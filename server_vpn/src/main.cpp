#include <iostream>
#include <cstdlib>
#include <csignal>
#include <string>
#include <sstream>
#include <set>
#include "httplib.h"
#include "nlohmann/json.hpp"

using json = nlohmann::json;
using namespace httplib;

// Todo: optimize
// remplace exec_command (shell) with cpp
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

std::string find_available_ip() {
    std::string users_dump = list_users();
    std::istringstream stream(users_dump);
    std::set<std::string> used_ips;

    std::string line;
    while (std::getline(stream, line)) {
        std::istringstream line_stream(line);
        std::string field;
        int column = 0;
        while (std::getline(line_stream, field, '\t')) {
            if (column == 3) {
                size_t pos = field.find('/');
                if (pos != std::string::npos) {
                    used_ips.insert(field.substr(0, pos));
                }
                break;
            }
            column++;
        }
    }

    for (int i = 2; i <= 254; ++i) {
        std::string candidate_ip = "10.0.0." + std::to_string(i);
        if (used_ips.find(candidate_ip) == used_ips.end()) {
            return (candidate_ip);
        }
    }

    return ("No available IP");
}

void add_user(const std::string &public_key, const std::string &ip) {
    std::string command = "wg set wg0 peer " + public_key + " allowed-ips " + ip;
    exec_command(command);
}

void remove_user(const std::string &public_key) {
    std::string command = "wg set wg0 peer " + public_key + " remove";
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

void signal_handler(int signal) {
    std::cout << "\nSignal received: " << signal << ". Stopping VPN..." << std::endl;
    stop_vpn();
    exit(0);
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

    svr.Post("/add_user", [](const Request &req, Response &res) {
        auto public_key = req.get_param_value("public_key");
        std::string ip = find_available_ip() + "/32";

        json response;
        if (ip == "No available IP") {
            response["status"] = "error";
            response["msg"] = "No available IP";
            res.status = 500;
        } else {
            add_user(public_key, ip);
            response["status"] = "success";
            response["msg"] = ip;
        }

        res.set_content(response.dump(), "application/json");
    });

    svr.Post("/remove_user", [](const Request &req, Response &res) {
        auto public_key = req.get_param_value("public_key");

        json response;
        remove_user(public_key);
        response["status"] = "success";
        response["msg"] = "User successfully removed.";

        res.set_content(response.dump(), "application/json");
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
