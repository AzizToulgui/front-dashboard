import Link from "next/link"

export const Plan = () => {
  return (
    <div className="flex sticky top-[calc(100vh_-_48px_-_16px)] flex-col h-12 border-t px-2 border-stone-300 justify-end text-xs ">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Karriery</p>
          <p className="text-stone-500">Enterprise</p>
        </div>

        <Link
          href="https://www.instagram.com/karrierytn/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1.5 font-medium bg-stone-200 hover:bg-stone-300 transition-colors rounded inline-block"
        >
          Support us
        </Link>
      </div>
    </div>
  )
}

