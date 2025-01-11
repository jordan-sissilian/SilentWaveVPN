import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

import logoS from "../../assets/SlientWaveVpnCli.png"

function MobileComponent() {
    return (
        <>
            <div className="tw-w-full tw-h-4/6 tw-flex tw-flex-col tw-justify-between lg:tw-hidden tw-block">
                <div className="tw-w-full tw-px-6 tw-mt-auto">
                    <h1 className="tw-text-4xl tw-font-bold tw-text-dark-blue tw-mb-10 tw-text-center">
                        Découvrez la puissance de SilentWaveVPN
                    </h1>
                    <p className="tw-text-lg tw-text-gray-500 tw-text-center tw-mb-10">
                        SilentWaveVPN vous offre une sécurité et une confidentialité inégalées pour naviguer en
                        toute tranquillité sur Internet. Profitez d'une connexion rapide et sécurisée, où que vous
                        soyez.
                    </p>
                </div>
            </div>

            <div className="tw-w-full tw-block lg:tw-hidden">
                <Swiper
                    spaceBetween={25}
                    slidesPerView="auto"
                    centeredSlides={true}
                    className="swiper-container"
                >
                    <SwiperSlide className="tw-w-2/3 tw-h-40 tw-bg-dark-blue tw-bg-opacity-30 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center">
                        <h2 className="tw-text-sm tw-font-bold tw-text-white tw-mt-4 tw-mb-1">Cachez votre IP</h2>
                        <p className="tw-text-xs tw-text-gray-200 tw-w-4/5 tw-max-w-[280px] tw-flex-grow tw-flex tw-items-center">Obtenez une nouvelle adresse IP, afin que personne ne puisse découvrir votre identité grâce à elle.</p>
                    </SwiperSlide>

                    <SwiperSlide className="tw-w-2/3 tw-h-40 tw-bg-dark-blue tw-bg-opacity-30 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center">
                        <h2 className="tw-text-sm tw-font-bold tw-text-white tw-mt-4 tw-mb-1">Aucun Log</h2>
                        <p className="tw-text-xs tw-text-gray-200 tw-w-4/5 tw-max-w-[280px] tw-flex-grow tw-flex tw-items-center">Aucune surveillance ni archivage de vos actions en ligne.</p>
                    </SwiperSlide>

                    <SwiperSlide className="tw-w-2/3 tw-h-40 tw-bg-dark-blue tw-bg-opacity-30 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center">
                        <h2 className="tw-text-sm tw-font-bold tw-text-white tw-mt-4 tw-mb-1">Protection Wi-Fi</h2>
                        <p className="tw-text-xs tw-text-gray-200 tw-w-4/5 tw-max-w-[280px] tw-flex-grow tw-flex tw-items-center">Connectez-vous à n'importe quel réseau sans fil sans risquer d'interception de données entre votre ordinateur et le point d'accès WiFi.</p>
                    </SwiperSlide>

                    <SwiperSlide className="tw-w-2/3 tw-h-40 tw-bg-dark-blue tw-bg-opacity-30 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center">
                        <h2 className="tw-text-sm tw-font-bold tw-text-white tw-mt-4 tw-mb-1">0 Information</h2>
                        <p className="tw-text-xs tw-text-gray-200 tw-w-4/5 tw-max-w-[280px] tw-flex-grow tw-flex tw-items-center">Aucun compte requis, pas d'informations personnelles, même pas une adresse email.</p>
                    </SwiperSlide>

                    <SwiperSlide className="tw-w-2/3 tw-h-40 tw-bg-dark-blue tw-bg-opacity-30 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center">
                        <h2 className="tw-text-sm tw-font-bold tw-text-white tw-mt-4 tw-mb-1">Sécurisée</h2>
                        <p className="tw-text-xs tw-text-gray-200 tw-w-4/5 tw-max-w-[280px] tw-flex-grow tw-flex tw-items-center">Nous utilisons WireGuard. Ce protocole moderne assure des tunnels cryptés fiables et rapides.</p>
                    </SwiperSlide>

                    <SwiperSlide className="tw-w-2/3 tw-h-40 tw-bg-dark-blue tw-bg-opacity-30 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center">
                        <h2 className="tw-text-sm tw-font-bold tw-text-white tw-mt-4 tw-mb-1">0 Limite</h2>
                        <p className="tw-text-xs tw-text-gray-200 tw-w-4/5 tw-max-w-[280px] tw-flex-grow tw-flex tw-items-center">Profitez d'un accès illimité à tous nos nœuds de sortie, sans restrictions de trafic ni de durée.</p>
                    </SwiperSlide>

                </Swiper>
            </div>
        </>
    );
}

function Header() {
    return (
        <section>
            <div className="tw-h-screen tw-w-full tw-flex tw-flex-col tw-items-center" style={{ background: "linear-gradient(-6deg, #0a2540 25%, rgb(255, 255, 255) 0%)", }}>
                <div className="tw-mt-20 tw-w-4/6 tw-h-5/6 tw-flex tw-items-center tw-justify-between lg:tw-flex tw-hidden">
                    <div className="tw-w-full lg:tw-w-3/6 tw-px-4 xl:tw-px-8">
                        <h1 className="tw-text-xl md:tw-text-3xl lg:tw-text-4xl xl:tw-text-5xl tw-font-bold tw-text-dark-blue tw-mb-4">
                            Découvrez la puissance de SilentWaveVPN
                        </h1>
                        <p className="tw-text-sm md:tw-text-base lg:tw-text-lg xl:tw-text-md tw-text-gray-500">
                            SilentWaveVPN vous offre une sécurité et une confidentialité inégalées pour naviguer en
                            toute tranquillité sur Internet. Profitez d'une connexion rapide et sécurisée, où que vous
                            soyez.
                        </p>
                    </div>


                    <div className="tw-w-full lg:tw-w-3/6 tw-flex tw-justify-end tw-items-center">
                        <img
                            src={logoS}
                            className="tw-w-4/6 lg:tw-w-full tw-h-auto tw-object-contain tw-scale-[80%] lg:tw-scale-100"
                            alt="SilentWaveVPN"
                        />
                    </div>

                </div>

                <div className="g:tw-flex tw-hidden tw-w-full lg:tw-w-5/6 xl:tw-w-5/6 tw-flex tw-justify-between tw-gap-4 tw-flex-wrap lg:tw-flex sm:tw-flex-col md:tw-flex-row lg:tw-flex-row tw-mx-auto">
                    <div className="tw-w-full sm:tw-w-1/3 md:tw-w-1/3 lg:tw-w-1/4 xl:tw-w-1/4 tw-h-[130px] tw-bg-white tw-bg-opacity-60 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center tw-justify-start">
                        <h2 className="tw-text-lg tw-font-bold tw-text-dark-blue tw-mb-1 tw-mt-2">Cachez votre IP</h2>
                        <p className="tw-text-xs tw-text-gray-700 tw-flex-grow tw-flex tw-items-center tw-w-4/5 tw-max-w-[280px] tw-px-4">Obtenez une nouvelle adresse IP, afin que personne ne puisse découvrir votre identité grâce à elle.</p>
                    </div>

                    <div className="tw-w-full sm:tw-w-1/3 md:tw-w-1/3 lg:tw-w-1/4 xl:tw-w-1/4 tw-h-[130px] tw-bg-white tw-bg-opacity-60 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center tw-justify-start">
                        <h2 className="tw-text-lg tw-font-bold tw-text-dark-blue tw-mb-1 tw-mt-2">Aucun Log</h2>
                        <p className="tw-text-xs tw-text-gray-700 tw-flex-grow tw-flex tw-items-center tw-w-4/5 tw-max-w-[280px] tw-px-4">Aucune surveillance ni archivage de vos actions en ligne.</p>
                    </div>

                    <div className="tw-w-full sm:tw-w-1/3 md:tw-w-1/3 lg:tw-w-1/4 xl:tw-w-1/4 tw-h-[130px] tw-bg-white tw-bg-opacity-60 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center tw-justify-start">
                        <h2 className="tw-text-lg tw-font-bold tw-text-dark-blue tw-mb-1 tw-mt-2">Protection Wi-Fi</h2>
                        <p className="tw-text-xs tw-text-gray-700 tw-flex-grow tw-flex tw-items-center tw-w-4/5 tw-max-w-[280px] tw-px-4">Connectez-vous à n'importe quel réseau sans fil sans risquer d'interception de données.</p>
                    </div>

                    <div className="tw-w-full sm:tw-w-1/3 md:tw-w-1/3 lg:tw-w-1/4 xl:tw-w-1/4 tw-h-[130px] tw-bg-white tw-bg-opacity-60 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center tw-justify-start">
                        <h2 className="tw-text-lg tw-font-bold tw-text-dark-blue tw-mb-1 tw-mt-2">0 Information</h2>
                        <p className="tw-text-xs tw-text-gray-700 tw-flex-grow tw-flex tw-items-center tw-w-4/5 tw-max-w-[280px] tw-px-4">Aucun compte requis, pas d'informations personnelles, même pas une adresse email.</p>
                    </div>

                    <div className="tw-w-full sm:tw-w-1/3 md:tw-w-1/3 lg:tw-w-1/4 xl:tw-w-1/4 tw-h-[130px] tw-bg-white tw-bg-opacity-60 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center tw-justify-start">
                        <h2 className="tw-text-lg tw-font-bold tw-text-dark-blue tw-mb-1 tw-mt-2">Sécurisée</h2>
                        <p className="tw-text-xs tw-text-gray-700 tw-flex-grow tw-flex tw-items-center tw-w-4/5 tw-max-w-[280px] tw-px-4">Nous utilisons WireGuard. Ce protocole moderne avec des tunnels cryptés fiables et rapides.</p>
                    </div>

                    <div className="tw-w-full sm:tw-w-1/3 md:tw-w-1/3 lg:tw-w-1/4 xl:tw-w-1/4 tw-h-[130px] tw-bg-white tw-bg-opacity-60 tw-rounded-lg tw-shadow-lg tw-backdrop-blur-lg tw-flex tw-flex-col tw-items-center tw-justify-start">
                        <h2 className="tw-text-lg tw-font-bold tw-text-dark-blue tw-mb-1 tw-mt-2">0 Limite</h2>
                        <p className="tw-text-xs tw-text-gray-700 tw-flex-grow tw-flex tw-items-center tw-w-4/5 tw-max-w-[280px] tw-px-4">Profitez d'un accès illimité à tous nos nœuds de sortie, sans restrictions de trafic ni de durée.</p>
                    </div>

                </div>

                <MobileComponent />
            </div>
        </section>
    );
}

export default Header;
