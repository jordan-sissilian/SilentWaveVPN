// WireGuardConfig.cpp
#include "WireGuardConfig.hpp"
#include <cstdlib>
#include <cstdio>


WireGuardConfig::WireGuardConfig() {
    generateKeys();
    configData_.configFilePath = CONFIG_FILE_VPN;
}

void WireGuardConfig::generateKeys() {
    configData_.privateKey = executeCommand("wg genkey");

    std::string output = executeCommand(std::string("echo \"" + configData_.privateKey + "\" | wg pubkey"));
    if (!output.empty() && output.back() == '\n') {
        output.erase(output.length() - 1);
    }
    configData_.publicKey = output;

    if (configData_.privateKey.empty() || configData_.publicKey.empty()) {
        throw std::runtime_error("Erreur lors de la génération des clés WireGuard.");
    }
}

std::string WireGuardConfig::executeCommand(const std::string& command) {
    char buffer[128];
    std::string result;

    FILE* pipe = popen(command.c_str(), "r");
    if (!pipe) {
        throw std::runtime_error("Échec de l'exécution de la commande: " + command);
    }

    while (fgets(buffer, sizeof(buffer), pipe) != nullptr) {
        result += buffer;
    }
    pclose(pipe);

    return result;
}

void WireGuardConfig::createConfigFile() {
    std::ofstream configFile(configData_.configFilePath);
    if (!configFile.is_open()) {
        throw std::runtime_error("Impossible de créer le fichier de configuration.");
    }

    configFile << "[Interface]\n"
               << "PrivateKey = \n"
               << "Address = \n"
               << "DNS = 94.140.14.14\n\n"
               << "[Peer]\n"
               << "PublicKey = \n"
               << "Endpoint = \n"
               << "AllowedIPs = 0.0.0.0/0, ::/0\n"
               << "PersistentKeepalive = 25\n";

    configFile.close();
    std::cout << "Fichier de configuration créé à : " << configData_.configFilePath << std::endl;
}

void WireGuardConfig::updateConfigFile(const WireGuardConfigData& newConfigData) {
    std::ofstream configFile(configData_.configFilePath, std::ios::trunc);
    if (!configFile.is_open()) {
        throw std::runtime_error("Impossible de mettre à jour le fichier de configuration.");
    }

    std::string ip = [&newConfigData]() {
        std::string ip;

        if (newConfigData.clientIPV4 != "unavailable") {
            ip += newConfigData.clientIPV4;
        }
        if (!newConfigData.clientIPV6.empty() && newConfigData.clientIPV6 != "unavailable") {
            if (!ip.empty()) {
                ip += ", "; 
            }
            ip += newConfigData.clientIPV6;
        }

        return (ip);
    }();
    configFile << "[Interface]\n"
               << "PrivateKey = " << newConfigData.privateKey << "\n"
               << "Address = " << ip << "\n"
               << "DNS = 94.140.14.14, 2606:4700:4700::1111\n\n"
               << "[Peer]\n"
               << "PublicKey = " << newConfigData.serverPublicKey << "\n"
               << "Endpoint = " << newConfigData.endpoint << ":" << newConfigData.port << "\n"
               << "AllowedIPs = 0.0.0.0/0, ::/0\n"
               << "PersistentKeepalive = 25\n";

    configFile.close();
    std::cout << "Fichier de configuration mis à jour à : " << configData_.configFilePath << std::endl;
}

void WireGuardConfig::startWireGuard() {
    std::string command = "sudo wg-quick up " + configData_.configFilePath;
    executeCommand(command);
    std::cout << "WireGuard démarré." << std::endl;
}

void WireGuardConfig::stopWireGuard() {
    std::string command = "sudo wg-quick down " + configData_.configFilePath;
    executeCommand(command);
    std::cout << "WireGuard arrêté." << std::endl;
}
