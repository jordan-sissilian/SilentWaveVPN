#pragma once

#include <string>
#include <map>
#include <httplib.h>
#include <nlohmann/json.hpp>

class VpnClient {
public:
    explicit VpnClient(const std::string& base_url);

    nlohmann::json getServersInfo(void);
    nlohmann::json getServerInfo(int id_host);
    nlohmann::json addUser(int id_host, const std::string& public_key);
    nlohmann::json removeUser(int id_host, const std::string& public_key);
    nlohmann::json countUsers(int id_host);
    nlohmann::json checkVpnStatus(int id_host);
    nlohmann::json ping(int id_host);

private:
    std::string base_url_;
    httplib::Client client_;

    std::string constructPath(const std::string& endpoint, const std::map<std::string, std::string>& params);
    nlohmann::json handleResponse(const httplib::Result& res);
};
