"use client";

import * as React from "react";
import Image from "next/image";
import { LightHeading } from "./LightHeading";
import { Reveal, Stagger, StaggerItem } from "./motion";

/**
 * Tech stack tiles. Each `img` points to a logo in /public/tech.
 */
const TILES: { img: string; label: string }[] = [
  { img: "/hashkey-logo1.png", label: "HashKey Chain" },
  { img: "/solidity.jpg", label: "Solidity" },
  { img: "/viem.png", label: "Viem" },
  { img: "/wagmi.jpg", label: "Wagmi" },
  { img: "/rainbowkit.png", label: "RainbowKit" },
  { img: "/nextjs.jpg", label: "Next.js" },
  { img: "/ai.jpg", label: "AI Engine" },
  { img: "/guardfi-logo.png", label: "Registry" },
];

function TileChip({
  img,
  label,
  reverse,
}: {
  img: string;
  label: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm ${
        reverse ? "flex-row-reverse" : ""
      }`}
    >
      <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
        <Image
          src={img}
          alt={`${label} logo`}
          width={72}
          height={72}
          className="h-16 w-16 object-contain rounded-lg"
        />
      </span>
      <span className="whitespace-nowrap text-sm font-semibold text-slate-700">
        {label}
      </span>
    </div>
  );
}

export function IntegrationsLight() {
  return (
    <section id="integrations" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <LightHeading
          label="Tech Stack"
          title="Built on a modern, verifiable Web3 stack"
          subtitle="Standard, battle-tested tooling — everything branches from one verifiable core."
        />

        {/* ---- Branching tree (sm and up) ---- */}
        <Reveal>
          <div className="relative mx-auto mt-14 hidden max-w-3xl sm:block">
            {/* Hub */}
            <div className="relative z-10 mx-auto flex w-fit items-center gap-2.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 shadow-sm">
              <Image
                src="/guardfi-logo.png"
                alt="GuardFi AI"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="font-display text-sm font-extrabold text-slate-900">
                GuardFi AI
              </span>
            </div>

            {/* trunk from hub into the tree */}
            <div className="mx-auto h-6 w-px bg-slate-200" />

            {/* rows branching off a central spine */}
            <div className="relative">
              {/* spine */}
              <div className="pointer-events-none absolute left-1/2 top-0 bottom-6 w-px -translate-x-1/2 bg-slate-200" />

              <div className="space-y-4">
                {TILES.map((t, i) => {
                  const left = i % 2 === 0;
                  return (
                    <div
                      key={t.label}
                      className="relative grid grid-cols-[1fr_28px_1fr] items-center"
                    >
                      {/* left slot */}
                      <div className="flex items-center justify-end">
                        {left && (
                          <div className="flex items-center">
                            <TileChip img={t.img} label={t.label} reverse />
                            <span className="h-px w-5 bg-slate-200" />
                          </div>
                        )}
                      </div>

                      {/* node on spine */}
                      <div className="flex justify-center">
                        <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-500 shadow-sm ring-1 ring-blue-200" />
                      </div>

                      {/* right slot */}
                      <div className="flex items-center justify-start">
                        {!left && (
                          <div className="flex items-center">
                            <span className="h-px w-5 bg-slate-200" />
                            <TileChip img={t.img} label={t.label} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ---- Simple stacked list (mobile) ---- */}
        <Stagger className="mt-10 grid grid-cols-1 gap-3 sm:hidden">
          {TILES.map((t) => (
            <StaggerItem key={t.label}>
              <TileChip img={t.img} label={t.label} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
