import React, { useState, useEffect } from "react";
import { Globe } from "../../components/Globe";
import axios from "axios";
import Flag from 'react-world-flags';


const ServerList = ({ servers, setServers }) => {
    const [serversStatus, setServersStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServers = async () => {
            try {
                const response = await axios.get("/info"); //todo remplace sith url
                const data = response.data;

                const transformedServers = Object.entries(data.vpn).map(([id, server]) => {
                    const country = server.localisation;
                    const countryCode = countryCodes[country] || country.replace(/\s+/g, '-');
                    return {
                        id,
                        name: server.name,
                        country: countryCode,
                        host: server.host,
                    };
                });

                setServers(transformedServers);
            } catch (err) {
                setError(err.message || "Une erreur est survenue.");
            } finally {
                setLoading(false);
            }
        };

        fetchServers();
    }, []);

    useEffect(() => {
        const fetchServersStatus = async (id) => {
            try {
                const response = await axios.get(`https://cors-anywhere.herokuapp.com/http://jordansissilian.fr:8082/${id - 1}/status`, {
                    headers: {
                        'Accept': 'application/json',
                    },
                }); const data = response.data;

                setServersStatus(prevState => ({
                    ...prevState,
                    [id]: data.status === 'success' ? 'En ligne' : 'Hors ligne'
                }));
            } catch (err) {
                setError(err.message || "Une erreur est survenue.");
                setServersStatus(prevState => ({
                    ...prevState,
                    [id]: 'Hors ligne'
                }));
            }
        };

        if (servers.length > 0) {
            servers.forEach((server) => {
                fetchServersStatus(server.id);
            });
        }
    }, [servers]);

    if (loading) return;

    const online = (
        <span className="tw-inline-flex tw-items-center tw-bg-green-100 tw-text-green-500 tw-text-xs tw-font-medium tw-ml-1 tw-px-2 tw-py-0.5 tw-rounded-full">
            <span className="tw-w-1.5 tw-h-1.5 tw-mr-1 tw-bg-green-400 tw-rounded-full"></span>
            En ligne
        </span>
    );

    const offline = (
        <span className="tw-inline-flex tw-items-center tw-bg-gray-100 tw-text-gray-500 tw-text-xs tw-font-medium tw-ml-1 tw-px-2 tw-py-0.5 tw-rounded-full">
            <span className="tw-w-1.5 tw-h-1.5 tw-mr-1 tw-bg-gray-400 tw-rounded-full"></span>
            Hors ligne
        </span>
    );

    return (
        <table className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow-lg tw-mt-5 lg:tw-w-[400px]">
            <thead>
                <tr className="tw-bg-gray-200">
                    <th className="tw-px-4 tw-py-2 tw-text-center">État</th>
                    <th className="tw-px-4 tw-py-2 tw-text-center">Nom</th>
                    <th className="tw-px-4 tw-py-2 tw-text-start">Pays</th>
                </tr>
            </thead>
            <tbody>
                {servers.map((server) => (
                    <tr key={server.id}>
                        <td className="tw-px-4 tw-py-2 tw-text-center">
                            {serversStatus[server.id] === 'En ligne' ? online : offline}
                        </td>
                        <td className="tw-px-4 tw-py-2 tw-text-center">{server.name}</td>
                        <td className="tw-px-4 tw-py-2 tw-items-center">
                            <Flag code={server.country.toUpperCase()} style={{ width: 20, height: 15 }} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

function InfoServer() {
    const [servers, setServers] = useState([]);

    const connected = (
        <span className="tw-inline-flex tw-items-center tw-bg-green-100 tw-text-green-500 tw-text-xs tw-font-medium tw-ml-3 tw-mr-3 tw-px-2 tw-py-0.5 tw-rounded-full">
            <span className="tw-w-1.5 tw-h-1.5 tw-bg-green-400 tw-rounded-full tw-mr-1"></span>
            Connecter
        </span>
    );

    const deconnected = (
        <span className="tw-inline-flex tw-items-center tw-bg-gray-100 tw-text-red-500 tw-text-xs tw-font-medium tw-ml-3 tw-mr-3 tw-px-2 tw-py-0.5 tw-rounded-full">
            <span className="tw-w-1.5 tw-h-1.5 tw-bg-red-400 tw-rounded-full tw-mr-1"></span>
            Déconnecter
        </span>
    );

    const [ip, setIp] = useState(null);
    useEffect(() => {
        const fetchIp = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setIp(response.data.ip);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'IP :", error);
            }
        };
        fetchIp();
    }, []);

    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        if (servers.length > 0 && ip) {
            let connectedStatus = false;
            servers.forEach((server) => {
                if (server.host === `${ip}:8080`) {
                    connectedStatus = true;
                }
            });
            setIsConnected(connectedStatus);
        }
    }, [ip]);

    return (
        <section>
            <div className="tw-h-auto tw-w-full tw-flex tw-flex-col tw-items-center tw-bg-blue-fn">
                <div className="tw-mt-10 tw-w-full xl:tw-w-5/6 tw-h-6/6 tw-flex lg:tw-items-start tw-items-center tw-justify-between">
                    <div className="tw-w-full tw-px-4 xl:tw-px-8 lg:tw-mt-10">
                        <h2 className="tw-text-3xl tw-font-semibold tw-text-white tw-mb-4 lg:tw-mt-20">
                            Suivi des Serveurs Actifs
                        </h2>
                        <p className="tw-text-lg tw-text-gray-400 tw-mb-8">
                            Découvrez ci-dessous la liste des Top serveurs actuellement en fonctionnement,
                            accompagnée de leur statut et de leur localisation.
                        </p>
                        <p className="tw-text-lg tw-text-gray-400 tw-mb-8 tw-hidden pxlg:tw-flex">
                            Chaque serveur est classé en fonction de son état de connexion et de sa géolocalisation, afin de vous fournir une vue d'ensemble claire et à jour de l'infrastructure.
                        </p>
                        <a href="" className="tw-text-lg tw-text-blue-link tw-mb-8 hover:tw-text-white">
                            Explorez davantage de serveurs
                        </a>
                        <ServerList servers={servers} setServers={setServers} />
                        <p className="tw-text-lg tw-text-gray-300 tw-mt-5 tw-flex tw-items-center tw-mb-20">
                            Votre IP : {isConnected ? connected : deconnected} <span className={isConnected ? "tw-text-green-500" : "tw-text-red-500"}>{ip}</span>
                        </p>
                    </div>
                    <div className="tw-flex tw-justify-center lg:tw-justify-end tw-items-center lg:tw-flex lg:hidden lg:tw-mt-10">
                        <div className="tw-relative tw-px-4 lg:tw-px-0 lg:tw-flex tw-hidden" style={{ maxWidth: '600px', overflow: 'hidden' }}>
                            <Globe />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default InfoServer;

const countryCodes = {
    "Afghanistan": "AF",
    "Albania": "AL",
    "Algeria": "DZ",
    "Andorra": "AD",
    "Angola": "AO",
    "Argentina": "AR",
    "Armenia": "AM",
    "Australia": "AU",
    "Austria": "AT",
    "Azerbaijan": "AZ",
    "Bahamas": "BS",
    "Bahrain": "BH",
    "Bangladesh": "BD",
    "Barbados": "BB",
    "Belarus": "BY",
    "Belgium": "BE",
    "Belize": "BZ",
    "Benin": "BJ",
    "Bhutan": "BT",
    "Bolivia": "BO",
    "Bosnia and Herzegovina": "BA",
    "Botswana": "BW",
    "Brazil": "BR",
    "Brunei": "BN",
    "Bulgaria": "BG",
    "Burkina Faso": "BF",
    "Burundi": "BI",
    "Cabo Verde": "CV",
    "Cambodia": "KH",
    "Cameroon": "CM",
    "Canada": "CA",
    "Central African Republic": "CF",
    "Chad": "TD",
    "Chile": "CL",
    "China": "CN",
    "Colombia": "CO",
    "Comoros": "KM",
    "Congo": "CG",
    "Costa Rica": "CR",
    "Croatia": "HR",
    "Cuba": "CU",
    "Cyprus": "CY",
    "Czech Republic": "CZ",
    "Denmark": "DK",
    "Djibouti": "DJ",
    "Dominica": "DM",
    "Dominican Republic": "DO",
    "Ecuador": "EC",
    "Egypt": "EG",
    "El Salvador": "SV",
    "Equatorial Guinea": "GQ",
    "Eritrea": "ER",
    "Estonia": "EE",
    "Eswatini": "SZ",
    "Ethiopia": "ET",
    "Fiji": "FJ",
    "Finland": "FI",
    "France": "FR",
    "Gabon": "GA",
    "Gambia": "GM",
    "Georgia": "GE",
    "Germany": "DE",
    "Ghana": "GH",
    "Greece": "GR",
    "Grenada": "GD",
    "Guatemala": "GT",
    "Guinea": "GN",
    "Guinea Bissau": "GW",
    "Guyana": "GY",
    "Haiti": "HT",
    "Honduras": "HN",
    "Hungary": "HU",
    "Iceland": "IS",
    "India": "IN",
    "Indonesia": "ID",
    "Iran": "IR",
    "Iraq": "IQ",
    "Ireland": "IE",
    "Israel": "IL",
    "Italy": "IT",
    "Jamaica": "JM",
    "Japan": "JP",
    "Jordan": "JO",
    "Kazakhstan": "KZ",
    "Kenya": "KE",
    "Kiribati": "KI",
    "North Korea": "KP",
    "South Korea": "KR",
    "Kuwait": "KW",
    "Kyrgyzstan": "KG",
    "Laos": "LA",
    "Latvia": "LV",
    "Lebanon": "LB",
    "Lesotho": "LS",
    "Liberia": "LR",
    "Libya": "LY",
    "Liechtenstein": "LI",
    "Lithuania": "LT",
    "Luxembourg": "LU",
    "Madagascar": "MG",
    "Malawi": "MW",
    "Malaysia": "MY",
    "Maldives": "MV",
    "Mali": "ML",
    "Malta": "MT",
    "Marshall Islands": "MH",
    "Mauritania": "MR",
    "Mauritius": "MU",
    "Mexico": "MX",
    "Micronesia": "FM",
    "Moldova": "MD",
    "Monaco": "MC",
    "Mongolia": "MN",
    "Montenegro": "ME",
    "Morocco": "MA",
    "Mozambique": "MZ",
    "Myanmar": "MM",
    "Namibia": "NA",
    "Nauru": "NR",
    "Nepal": "NP",
    "Netherlands": "NL",
    "New Zealand": "NZ",
    "Nicaragua": "NI",
    "Niger": "NE",
    "Nigeria": "NG",
    "North Macedonia": "MK",
    "Norway": "NO",
    "Oman": "OM",
    "Pakistan": "PK",
    "Palau": "PW",
    "Panama": "PA",
    "Papua New Guinea": "PG",
    "Paraguay": "PY",
    "Peru": "PE",
    "Philippines": "PH",
    "Poland": "PL",
    "Portugal": "PT",
    "Qatar": "QA",
    "Romania": "RO",
    "Russia": "RU",
    "Rwanda": "RW",
    "Saint Kitts and Nevis": "KN",
    "Saint Lucia": "LC",
    "Saint Vincent and the Grenadines": "VC",
    "Samoa": "WS",
    "San Marino": "SM",
    "Sao Tome and Principe": "ST",
    "Saudi Arabia": "SA",
    "Senegal": "SN",
    "Serbia": "RS",
    "Seychelles": "SC",
    "Sierra Leone": "SL",
    "Singapore": "SG",
    "Slovakia": "SK",
    "Slovenia": "SI",
    "Solomon Islands": "SB",
    "Somalia": "SO",
    "South Africa": "ZA",
    "South Sudan": "SS",
    "Spain": "ES",
    "Sri Lanka": "LK",
    "Sudan": "SD",
    "Suriname": "SR",
    "Sweden": "SE",
    "Switzerland": "CH",
    "Syria": "SY",
    "Taiwan": "TW",
    "Tajikistan": "TJ",
    "Tanzania": "TZ",
    "Thailand": "TH",
    "Timor Leste": "TL",
    "Togo": "TG",
    "Tonga": "TO",
    "Trinidad and Tobago": "TT",
    "Tunisia": "TN",
    "Turkey": "TR",
    "Turkmenistan": "TM",
    "Tuvalu": "TV",
    "Uganda": "UG",
    "Ukraine": "UA",
    "United Arab Emirates": "AE",
    "United Kingdom": "GB",
    "United States": "US",
    "Uruguay": "UY",
    "Uzbekistan": "UZ",
    "Vanuatu": "VU",
    "Vatican City": "VA",
    "Venezuela": "VE",
    "Vietnam": "VN",
    "Yemen": "YE",
    "Zambia": "ZM",
    "Zimbabwe": "ZW"
};
