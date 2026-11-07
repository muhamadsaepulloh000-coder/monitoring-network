interface ErrorStateProps {
  title: string
  message: string
}

export function ErrorState({ title, message }: ErrorStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-[#3E2626] bg-[#171315] px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-red-200">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-red-300/80">{message}</p>
    </div>
  )
}
