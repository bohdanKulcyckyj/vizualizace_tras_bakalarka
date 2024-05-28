import { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
  identifier: number
  openedIdenfier: number
  onOpenIdenfier: (id: number) => void
}

const AccordionItem = ({
  children,
  title,
  identifier,
  openedIdenfier,
  onOpenIdenfier,
}: Props) => {
  return (
    <div className='accordion-item p-2 mb-2'>
      <button
        onClick={() => onOpenIdenfier(identifier)}
        className='flex justify-between items-center w-full'
      >
        <h3 className='text-18px font-medium uppercase'>{title}</h3>
        <span>+</span>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${openedIdenfier === identifier ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0  mt-0'}`}
      >
        <div className='overflow-hidden'>{children}</div>
      </div>
    </div>
  )
}

export default AccordionItem
