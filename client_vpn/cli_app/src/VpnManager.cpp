#include "VpnManager.hpp"

VpnManager::VpnManager() : client("http://jordansissilian.fr:8082") {}

nlohmann::json VpnManager::getServersInfo() {
    return client.getServersInfo();
}

nlohmann::json VpnManager::selectServer() {
    serversInfo = getServersInfo();

    std::cout << R"(            ╔══════════════════════════════════════════════════╗
            ║               SERVEUR DISPONIBLES                ║
            ╠══════════════════════════════════════════════════╣)" << std::endl;

    for (size_t i = 0; i < serversInfo["vpn"].size(); i++) {
       auto server = serversInfo["vpn"][std::to_string(i + 1)];
        std::string line = "            ║        " 
                           + std::to_string(i + 1) + ". " 
                           + server["name"].get<std::string>() + ": " 
                           + server["localisation"].get<std::string>();

        int remainingSpace = 65 - line.length();
        std::cout << line << std::setw(remainingSpace) << " " << "║" << std::endl; 
    }
    std::cout << "            ║        0. Retour                                 ║" << std::endl;
    std::cout << "            ╚══════════════════════════════════════════════════╝\n" << std::endl;
    std::cout << "  >> ";
    int indexServer;
    while (!(std::cin >> indexServer) || indexServer < 0 || indexServer > serversInfo["vpn"].size()) {
        std::cerr << "Entrée invalide.\n\tEntrez un numéro de serveur valide. (entre 1 et " << serversInfo["vpn"].size() << ")" << std::endl;
        std::cout << "\n  >> ";
        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    }
    if (!indexServer) {
        return {};
    }
    indexServer--;

    auto serverInfo = client.getServerInfo(indexServer);
    std::string serverPublicKey = serverInfo["public_key"];
    std::string serverPublicIp = serverInfo["public_ip"];
    auto addUser = client.addUser(indexServer, wgConfig.getPublicKey());

    if (addUser["status"] == "error") {
        std::string errorMsg = addUser["msg"].get<std::string>();
        std::cerr << "Erreur: " << errorMsg << std::endl;
    } else {
        std::string clientIPV4 = addUser["ipv4"];
        std::string clientIPV6 = addUser["ipv6"];

        WireGuardConfigData configData {
            wgConfig.getPrivateKey(),
            wgConfig.getPublicKey(),
            serverPublicKey,
            clientIPV4,
            clientIPV6,
            serverPublicIp,
            51820,
            "config_file_path"
        };
        wgConfig.updateConfigFile(configData);
    }
    return (serversInfo["vpn"][std::to_string(indexServer + 1)]);
}

void VpnManager::startVpn() {
    wgConfig.startWireGuard();
    std::cout << "VPN démarré avec succès." << std::endl;
}

void VpnManager::stopVpn() {
    wgConfig.stopWireGuard();
}
