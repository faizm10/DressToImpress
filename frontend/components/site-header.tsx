import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <Link 
          href="https://langdresstoimpress.betteruptime.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <iframe 
            src="https://langdresstoimpress.betteruptime.com/badge?theme=light" 
            width="250" 
            height="30" 
            frameBorder="0" 
            scrolling="no" 
            style={{ colorScheme: 'normal' }}
            title="BetterStack Status Badge"
          />
        </Link>
      </div>
    </header>
  )
}
