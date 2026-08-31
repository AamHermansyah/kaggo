"use client"

import Link from "next/link"
import { ExternalLink, Home, Menu, MessageCircle } from "lucide-react"

import { SocialIcon } from "@/components/shared/social-icons"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ROUTES } from "@/lib/routes"
import { socialLinks, SUPPORT, supportHref } from "@/lib/site-config"

export function SiteMenu() {
  const socials = socialLinks()

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="Open menu"
            className="size-9 shrink-0 rounded-md border-border/70 shadow-none"
          >
            <Menu />
          </Button>
        }
      />

      <SheetContent side="right" className="flex w-72 flex-col gap-0 p-0">
        <SheetHeader className="px-5 pt-5 pb-3">
          <SheetTitle className="text-[17px]">Driver Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Driver portal navigation, support, and company contact
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col px-2 py-1">
          <SheetClose
            render={
              <Link
                href={ROUTES.home}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-accent"
              >
                <span className="flex items-center gap-2.5">
                  <Home className="size-4.5 shrink-0 text-muted-foreground" />
                  Vehicle Lookup
                </span>
              </Link>
            }
          />

          <SheetClose
            render={
              <a
                href={supportHref("MyKaggo Driver assistance request")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-accent"
              >
                <span className="flex items-center gap-2.5">
                  <MessageCircle className="size-4.5 shrink-0 text-primary" />
                  Driver Support (WhatsApp)
                </span>
                <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
              </a>
            }
          />
        </nav>

        <div className="mt-auto flex flex-col gap-4 px-5 pt-4 pb-6">
          <Separator />

          <div className="flex flex-col gap-3">
            <h2 className="text-[13px] font-semibold tracking-wide text-foreground/70 uppercase">
              Connect with us
            </h2>

            {socials.length > 0 ? (
              <ul className="flex items-center gap-4">
                {socials.map((social) => (
                  <li key={social.network}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="block text-foreground/55 transition-colors hover:text-foreground"
                    >
                      <SocialIcon network={social.network} className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                Social links are not configured yet.
              </p>
            )}
          </div>

          <p className="text-[12px] leading-relaxed text-muted-foreground">
            <a
              href={`mailto:${SUPPORT.email}`}
              className="hover:text-foreground hover:underline"
            >
              {SUPPORT.email}
            </a>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
