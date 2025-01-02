#pragma once

#include <string>
#include <iostream>
#include <fstream>
#include <stdexcept>
#include <sys/stat.h>
#include <unistd.h>
#include <cstdlib>
#include <cstdio>

#define CONFIG_FILE_VPN "/Users/Shared/wireguard/vpn.conf"

struct WireGuardConfigData {
    std::string privateKey;
    std::string publicKey;
    std::string serverPublicKey;
    std::string clientIPV4;
    std::string clientIPV6;
    std::string endpoint;
    int port;
    std::string configFilePath;
};

class WireGuardConfig {
public:
    WireGuardConfig();

    const std::string& getPrivateKey() const { return configData_.privateKey; }
    const std::string& getPublicKey() const { return configData_.publicKey; }

    void createConfigFile();
    void updateConfigFile(const WireGuardConfigData& newConfigData);
    void startWireGuard();
    void stopWireGuard();

    WireGuardConfigData getData() const { return configData_; }

private:
    WireGuardConfigData configData_;

    void generateKeys();
    static std::string executeCommand(const std::string& command);
};
