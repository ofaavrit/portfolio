"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Send, AlertTriangle, Mail, Phone, AtSign, Link2 } from "lucide-react";
import type { ContactChannel, ContactContent, SocialLink } from "@aavrit/core";
import { burstConfetti } from "@/components/confetti";

type Status = "idle" | "sending" | "success" | "error";

function channelIcon(href: string) {
  if (href.startsWith("mailto:")) return Mail;
  if (href.startsWith("tel:")) return Phone;
  if (href.includes("instagram.com")) return AtSign;
  return Link2;
}

export default function ContactBlock({
  content,
  heading = "h2",
  email,
  socials,
  channels = [],
}: {
  content: ContactContent;
  heading?: "h1" | "h2";
  email: string;
  socials: SocialLink[];
  channels?: ContactChannel[];
}) {
  const H = heading;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    // Honeypot: bots fill every field. Humans never see this one.
    if ((data.get("website") as string)?.trim()) {
      setStatus("success"); // silently accept, store nothing
      form.reset();
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          body: data.get("body"),
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      form.reset();
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 34);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error && err.message.length < 160
          ? err.message
          : "Something went wrong. Please try again in a moment.",
      );
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      <div className="flex flex-col gap-6">
        <H className="display display-xl" style={{ color: "var(--tone-fg)" }}>
          {content.title}
        </H>
        <p className="max-w-[46ch] leading-relaxed" style={{ color: "var(--tone-muted)" }}>
          {content.body}
        </p>
        {channels.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="mono-label opacity-70" style={{ color: "var(--tone-muted)" }}>
              EVERY INBOX & HANDLE
            </p>
            <ul className="flex flex-col gap-2">
              {channels.map((c) => {
                const Icon = channelIcon(c.href);
                return (
                  <li key={c.value + c.href}>
                    <a
                      href={c.href}
                      {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-3 rounded-2xl border-2 px-4 py-2.5 transition-transform duration-150 hover:-translate-y-0.5"
                      style={{ borderColor: "var(--tone-border)", background: "var(--tone-card)", color: "var(--tone-oncard)" }}
                    >
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-[#111]"
                        style={{ background: "#ffd200" }}
                      >
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="mono-label block text-[0.6rem] opacity-70">{c.label}</span>
                        <span className="font-semibold break-all">{c.value}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="mono-label opacity-70" style={{ color: "var(--tone-muted)" }}>
              OR EMAIL DIRECTLY
            </p>
            <a href={`mailto:${email}`} className="link-sweep font-hand text-2xl" style={{ color: "var(--tone-fg)" }}>
              {email}
            </a>
          </div>
        )}
        {content.showSocials && socials.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="mono-label opacity-70" style={{ color: "var(--tone-muted)" }}>
              ELSEWHERE
            </p>
            <ul className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill transition-transform duration-150 hover:-translate-y-0.5"
                    style={{ color: "var(--tone-fg)" }}
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div>
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              className="sticker flex flex-col items-center gap-4 p-10 text-center"
              style={{ background: "#ceef32" }}
              role="status"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[#111] bg-[#ffd200]">
                <Check size={26} strokeWidth={3} aria-hidden="true" />
              </span>
              <p className="display text-3xl" style={{ color: "#111" }}>
                Message sent!
              </p>
              <p aria-hidden="true" className="stamp-in voice-marker text-2xl" style={{ color: "#060029" }}>
                DELIVERED ✓
              </p>
              <p className="max-w-[36ch] text-sm" style={{ color: "#111" }}>
                Thanks for writing — it landed safely in the inbox. Replies happen after school.
              </p>
              <button type="button" onClick={() => setStatus("idle")} className="btn btn-ghost mt-2" style={{ color: "#111" }}>
                Send another
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              noValidate={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="mono-label" style={{ color: "var(--tone-fg)" }}>
                    NAME *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    className="field"
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="mono-label" style={{ color: "var(--tone-fg)" }}>
                    EMAIL *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={120}
                    autoComplete="email"
                    className="field"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-subject" className="mono-label" style={{ color: "var(--tone-fg)" }}>
                  SUBJECT (OPTIONAL)
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  maxLength={120}
                  className="field"
                  placeholder="What's this about?"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-body" className="mono-label" style={{ color: "var(--tone-fg)" }}>
                  MESSAGE *
                </label>
                <textarea
                  id="contact-body"
                  name="body"
                  required
                  minLength={10}
                  maxLength={4000}
                  rows={6}
                  className="field resize-y"
                  placeholder="Say hi, share an idea, ask about a website…"
                />
              </div>

              {/* honeypot — hidden from humans, irresistible to bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="contact-website">Website</label>
                <input
                  ref={honeypotRef}
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" className="btn" disabled={status === "sending"}>
                  {status === "sending" ? (
                    "Sending…"
                  ) : (
                    <>
                      Send message <Send size={16} aria-hidden="true" />
                    </>
                  )}
                </button>
                <p className="mono-label opacity-60" style={{ color: "var(--tone-muted)" }}>
                  NO TRACKING · NO NEWSLETTERS
                </p>
              </div>

              <div aria-live="polite" role="status">
                {status === "error" ? (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticker mt-2 inline-flex items-center gap-2 px-4 py-3 text-sm"
                    style={{ background: "#ff9ec4" }}
                  >
                    <AlertTriangle size={16} aria-hidden="true" /> {errorMsg}{" "}
                    <a href={`mailto:${email}`} className="underline underline-offset-2" style={{ color: "#33021a" }}>
                      Email me instead
                    </a>
                  </motion.p>
                ) : null}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
