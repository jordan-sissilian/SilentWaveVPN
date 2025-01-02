#include <iostream>
#include <cstdlib>
#include <csignal>
#include <string>
#include <sstream>
#include <set>
#include <tuple>

#include "httplib.h"
#include "nlohmann/json.hpp"

using json = nlohmann::json;
using namespace httplib;

// Todo: optimize
// Todo: user_delete (DELETE, actual POST)
// remplace exec_command (shell) with cpp code
std::string exec_command(const std::string &command) {
    char buffer[128];
    std::string result;
    FILE *pipe = popen(command.c_str(), "r");
    if (!pipe) {
        return ("Error executing command!");
    }
    while (fgets(buffer, sizeof(buffer), pipe) != nullptr) {
        result += buffer;
    }
    pclose(pipe);
    return (result);
}

void start_vpn() {
    exec_command("wg-quick up wg0");
    std::cout << "WireGuard started." << std::endl;
}

void stop_vpn() {
    exec_command("wg-quick down wg0");
    std::cout << "WireGuard stopped." << std::endl;
}

void signal_handler(int signal) {
    std::cout << "\nSignal received: " << signal << ". Stopping VPN..." << std::endl;
    stop_vpn();
    exit(0);
}

std::string get_server_public_key() {
    std::string result = exec_command("wg show wg0");
    size_t pos = result.find("public key:");

    if (pos != std::string::npos) {
        result = result.substr(pos + 12);
        size_t end_pos = result.find("\n");
        if (end_pos != std::string::npos) {
            return result.substr(0, end_pos);
        }
    }

    return "Unable to find public key.";
}

std::string list_users() {
    return (exec_command("wg show wg0 dump"));
}

std::tuple<std::string, std::string> find_available_ip() {
    std::string users_dump = list_users();

    std::istringstream stream(users_dump);
    std::set<std::string> used_ips;

    std::string line;
    while (std::getline(stream, line)) {
        std::istringstream line_stream(line);
        std::string field;
        
        for (int column = 0; std::getline(line_stream, field, '\t'); column++) {
            if (column == 3) {
                size_t pos = field.find('/');
                if (pos != std::string::npos) {
                    std::string ip = field.substr(0, pos);
                    used_ips.insert(ip);
                }
                break;
            }
        }
    }

    std::string available_ipv4;
    std::string available_ipv6;

    // Recherche d'une adresse IPv4 disponible
    for (int i = 2; i <= 254; ++i) {
        std::string candidate_ipv4 = "10.0.0." + std::to_string(i);
        if (used_ips.find(candidate_ipv4) == used_ips.end()) {
            available_ipv4 = candidate_ipv4;
            break;
        }
    }

    // Recherche d'une adresse IPv6 disponible
    for (int i = 2; i <= 254; ++i) {
        std::string candidate_ipv6 = "fd00::" + std::to_string(i);
        if (used_ips.find(candidate_ipv6) == used_ips.end()) {
            available_ipv6 = candidate_ipv6;
            break;
        }
    }

    if (available_ipv4.empty() || available_ipv6.empty()) {
        std::cerr << "No available IPv4 or IPv6 address found." << std::endl;
        return {"No available IPv4", "No available IPv6"};
    }
    std::cout << "Found available IPs: IPv4 = " << available_ipv4  << ", IPv6 = " << available_ipv6 << std::endl;
    return {available_ipv4, available_ipv6};
}

void add_user(const std::string &public_key, const std::tuple<std::string, std::string> &ips) {
    const std::string &ipv4 = std::get<0>(ips);
    const std::string &ipv6 = std::get<1>(ips);

    if ((ipv4.empty() || ipv4 == "No available IPv4") && (ipv6.empty() || ipv6 == "No available IPv6")) {
        std::cerr << "Error: No valid IP addresses (IPv4 or IPv6) available for user." << std::endl;
        return;
    }

    std::string command = "wg set wg0 peer \"" + public_key + "\" allowed-ips ";
    if (!ipv4.empty() && ipv4 != "No available IPv4") {
        command += ipv4 + "/32";
    }
    if (!ipv6.empty() && ipv6 != "No available IPv6") {
        if (!ipv4.empty() && ipv4 != "No available IPv4") {
            command += ",";
        }
        command += ipv6 + "/128";
    }

    std::cout << "Executing command: " << command << std::endl;
    exec_command(command);
}

void remove_user(const std::string &public_key) {
    std::string command = "wg set wg0 peer \"" + public_key + "\" remove";
    std::cout << command << std::endl;
    exec_command(command);
}

std::string get_vpn_status() {
    std::string result = exec_command("wg show wg0");

    if (result.find("interface: wg0") != std::string::npos) {
        return ("started");
    }
    return ("stopped");
}

std::string get_public_ip() {
    std::string command = "curl http://ifconfig.me";
    return exec_command(command);
}

int main() {
    std::signal(SIGINT, signal_handler);
    std::signal(SIGTERM, signal_handler);

    start_vpn();

    Server svr;

    svr.Get("/server", [](const Request &, Response &res) {
        json response;
        std::string public_key = get_server_public_key();
        std::string public_ip = get_public_ip();

        if (public_key == "Unable to find public key.") {
            response["status"] = "error";
            response["msg"] = "Unable to retrieve the server public key.";
            res.status = 500;
        } else if (public_ip.empty()) {
            response["status"] = "error";
            response["msg"] = "Unable to retrieve the server public IP.";
            res.status = 500;
        } else {
            response["status"] = "success";
            response["msg"] = "Server public key and IP retrieved.";
            response["public_key"] = public_key;
            response["public_ip"] = public_ip;
        }

        res.set_content(response.dump(), "application/json");
    });

    svr.Post("/user", [](const Request &req, Response &res) {
        json body = json::parse(req.body);
        auto public_key = body["public_key"].get<std::string>();

        auto [ipv4, ipv6] = find_available_ip();

        json response;
        if ((ipv4 == "No available IPv4" && ipv6 == "No available IPv6")) {
            response["status"] = "error";
            response["msg"] = "No available IPs";
            res.status = 500;
        } else {
            add_user(public_key, {ipv4, ipv6});

            response["status"] = "success";
            response["ipv4"] = "unavailable";
            response["ipv6"] = "unavailable";
            if (ipv4 != "No available IPv4") {
                response["ipv4"] = ipv4 + "/32";
            }
            if (ipv6 != "No available IPv6") {
                response["ipv6"] = ipv6 + "/128";
            }
        }

        res.set_content(response.dump(), "application/json");
        std::cout << "Response: " << response.dump() << std::endl;
    });

    svr.Post("/user_delete", [](const Request &req, Response &res) {
        json body = json::parse(req.body);
        std::cout << "Request Body: " << req.body << std::endl;

        auto public_key = body["public_key"].get<std::string>();
        std::cout << "Received public_key: " << public_key << std::endl;

        if (public_key.empty()) {
            json response;
            response["status"] = "error";
            response["msg"] = "Missing public_key in request header.";
            res.status = 400;
            res.set_content(response.dump(), "application/json");

            std::cout << "Error: Missing public_key in request header. Response status set to 400." << std::endl;
            return;
        }

        remove_user(public_key);
        std::cout << "User with public_key " << public_key << " removed." << std::endl;

        json response;
        response["status"] = "success";
        response["msg"] = "User successfully removed.";
        res.set_content(response.dump(), "application/json");

        std::cout << "Response: " << response.dump() << std::endl;
    });

    svr.Get("/count_users", [](const Request &, Response &res) {
        std::string users = list_users();
        int count_users = -1;

        for (char c : users) {
            if (c == '\n') {
                count_users++;
            }
        }

        json response;
        if (users.empty()) {
            response["status"] = "error";
            response["msg"] = "Unable to count users.";
            res.status = 500;
        } else {
            response["status"] = "success";
            response["msg"] = "Number of users connected.";
            response["user_count"] = count_users;
        }

        res.set_content(response.dump(), "application/json");
    });

    svr.Get("/status", [](const Request &, Response &res) {
        json response;
        std::string vpn_status = get_vpn_status();

        if (vpn_status == "started") {
            response["status"] = "success";
            response["msg"] = "The VPN is started.";
        } else {
            response["status"] = "error";
            response["msg"] = "The VPN is stopped.";
        }

        res.set_content(response.dump(), "application/json");
    });

    svr.Get("/ping", [](const Request &, Response &res) {
        json response;

        response["status"] = "success";
        res.set_content(response.dump(), "application/json");
    });

    svr.listen("0.0.0.0", 8080);

    return (0);
}
