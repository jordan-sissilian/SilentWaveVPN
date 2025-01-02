#include "VpnClient.hpp"

VpnClient::VpnClient(const std::string& base_url) : base_url_(base_url), client_(base_url) {}

std::string VpnClient::constructPath(const std::string& endpoint, const std::map<std::string, std::string>& params) {
    std::string path = endpoint;
    for (const auto& [key, value] : params) {
        size_t pos = path.find("{" + key + "}");
        if (pos != std::string::npos) {
            path.replace(pos, key.length() + 2, value);
        }
    }
    return path;
}

nlohmann::json VpnClient::handleResponse(const httplib::Result& res) {
    if (!res || res->status != 200) {
        return nlohmann::json{{"status", res->status}, {"msg", res->body}};
    }
    try {
        nlohmann::json jsonResponse = nlohmann::json::parse(res->body);
        return jsonResponse;
    } catch (...) {
        std::cerr << "Erreur lors du parsing JSON. Corps de la réponse : " << res->body << std::endl;
        return nlohmann::json{{"status", "error"}, {"msg", "JSON parse error"}};
    }
}

nlohmann::json VpnClient::getServersInfo(void) {
    std::string path = "/info";
    auto res = client_.Get(path.c_str());
    return handleResponse(res);
}

nlohmann::json VpnClient::getServerInfo(int id_host) {
    std::string path = constructPath("/{id_host}/server", { {"id_host", std::to_string(id_host)} });
    auto res = client_.Get(path.c_str());
    return handleResponse(res);
}

nlohmann::json VpnClient::addUser(int id_host, const std::string& public_key) {
    std::string path = "/" + std::to_string(id_host) + "/user";
    nlohmann::json body = { {"public_key", public_key} };
    body.dump(4);
    auto res = client_.Post(path.c_str(), body.dump(), "application/json");
    return handleResponse(res);
}

nlohmann::json VpnClient::removeUser(int id_host, const std::string& public_key) {
    std::string path = "/" + std::to_string(id_host) + "/user_delete";
    nlohmann::json body = { {"public_key", public_key} };
    body.dump(4);
    auto res = client_.Post(path.c_str(), body.dump(), "application/json");
    return handleResponse(res);
}

nlohmann::json VpnClient::countUsers(int id_host) {
    std::string path = constructPath("/{id_host}/count_users", { {"id_host", std::to_string(id_host)} });
    auto res = client_.Get(path.c_str());
    return handleResponse(res);
}

nlohmann::json VpnClient::checkVpnStatus(int id_host) {
    std::string path = constructPath("/{id_host}/status", { {"id_host", std::to_string(id_host)} });
    auto res = client_.Get(path.c_str());
    return handleResponse(res);
}

nlohmann::json VpnClient::ping(int id_host) {
    std::string path = constructPath("/{id_host}/ping", { {"id_host", std::to_string(id_host)} });
    auto res = client_.Get(path.c_str());
    return handleResponse(res);
}