#pragma once

#include "WireGuardConfig.hpp"
#include "VpnClient.hpp"

#include <iostream>
#include <limits>

class VpnManager {
public:
    VpnManager();
    void startVpn();
    void stopVpn();
    nlohmann::json selectServer();
    nlohmann::json getServersInfo();

private:
    VpnClient client;
    WireGuardConfig wgConfig;
    nlohmann::json serversInfo;

    std::string hostConnected;
};
