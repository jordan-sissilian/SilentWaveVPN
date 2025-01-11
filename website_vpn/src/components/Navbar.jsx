import React, { useState } from "react";

import logoB from "../assets/SilentWaveVpn.png"
import logoS from "../assets/LogoVpn.png"

function ResponsiveNav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-z-50">
            <div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-px-4 tw-py-3 lg:tw-justify-center tw-w-4/6">
                <div className="tw-flex tw-items-center tw-relative tw-w-20 tw-h-20 tw-w-1/6">
                    <img
                        src={logoB}
                        alt="SilentWaveVpnLogo"
                        className="tw-absolute tw-scale-[220%] tw-w-auto tw-h-auto tw-object-contain tw-hidden lg:tw-block"
                    />
                    <img
                        src={logoS}
                        alt="SilentWaveVpnLogo"
                        className="tw-absolute tw-scale-[100%] tw-w-auto tw-h-auto tw-object-contain lg:tw-hidden tw-block"
                    />
                </div>

                <div className="tw-hidden lg:tw-flex tw-items-center tw-space-x-4 tw-w-3/6 tw-justify-center">
                    <a href="#" className="tw-text-dark-blue hover:tw-text-blue-500">Acceuil</a>
                    <a href="#" className="tw-text-dark-blue hover:tw-text-blue-500">Solution</a>
                    <a href="#" className="tw-text-dark-blue hover:tw-text-blue-500">Serveur</a>
                    <a href="#" className="tw-text-dark-blue hover:tw-text-blue-500">Développeurs</a>
                </div>

                <div className="tw-hidden lg:tw-flex tw-items-center tw-w-1/6">
                    <a href="#" className="tw-text-dark-blue hover:tw-text-blue-500 tw-mr-3">Télécharger</a>
                    <a href="https://donate.stripe.com/14k6r7fPJcfL3OoaEI" className="tw-bg-white tw-border tw-border-green-600 tw-text-green-600 tw-rounded-full tw-w-[120px] tw-h-[35px] tw-text-center tw-flex tw-items-center tw-justify-center">Soutenir</a>
                </div>
                <button
                    className="lg:tw-hidden tw-flex tw-items-center tw-text-dark-blue"
                    onClick={toggleMobileMenu}
                >
                    <svg
                        className="tw-w-6 tw-h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className={`tw-fixed tw-top-0 tw-left-0 tw-z-50 tw-bg-white tw-w-full tw-h-full tw-p-4 tw-flex tw-items-center tw-justify-center tw-transition-transform tw-duration-500 tw-ease-in-out ${isMobileMenuOpen ? "tw-transform-none" : "tw-transform -tw-translate-x-full"}`}>
                    <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-full tw-w-full tw-p-4">
                        <div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="tw-absolute tw-top-8 tw-right-3 tw-border tw-px-4 tw-py-2 tw-rounded-full tw-text-dark-blue">
                                Retour
                            </button>
                        </div>

                        <div className="tw-flex tw-flex-col tw-items-start tw-w-full tw-pb-4">
                            <a href="#" className="tw-flex tw-items-center tw-text-dark-blue hover:tw-text-blue-700 tw-mb-4 tw-text-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="tw-w-6 tw-h-6 tw-mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 10l5 5L20 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Accueil
                            </a>
                            <a href="#" className="tw-flex tw-items-center tw-text-dark-blue hover:tw-text-blue-700 tw-mb-4 tw-text-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="tw-w-6 tw-h-6 tw-mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Solution
                            </a>
                            <a href="#" className="tw-flex tw-items-center tw-text-dark-blue hover:tw-text-blue-700 tw-mb-4 tw-text-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="tw-w-6 tw-h-6 tw-mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 13h18M3 6h18M3 19h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Serveur
                            </a>
                            <a href="#" className="tw-flex tw-items-center tw-text-dark-blue hover:tw-text-blue-700 tw-mb-4 tw-text-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="tw-w-6 tw-h-6 tw-mr-2" viewBox="0 -5 24 24" fill="none" stroke="currentColor">
                                    <path d="M16 2l6 6-6 6M8 2l-6 6 6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Développeurs
                            </a>
                            <a href="#" className="tw-flex tw-items-center tw-text-dark-blue hover:tw-text-blue-700 tw-mb-4 tw-text-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="tw-w-6 tw-h-6 tw-mr-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Télécharger
                            </a>
                        </div>

                        <div className="tw-border-t tw-border-gray-300 tw-mt-6 tw-w-full"></div>

                        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-mt-6">
                            <p className="tw-text-sm tw-text-gray-600 tw-mt-4 tw-text-center tw-mb-4">
                                Votre don permet de financer nos serveurs et d'améliorer nos VPN pour une meilleure expérience en ligne.
                            </p>
                            <a href="https://donate.stripe.com/14k6r7fPJcfL3OoaEI" className="tw-bg-green-600 tw-text-white tw-px-6 tw-py-2 tw-rounded-full">
                                Soutenir le projet
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </nav>
    );
}

export default ResponsiveNav;
