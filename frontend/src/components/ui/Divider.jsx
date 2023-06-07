import { default as cn } from 'classnames'

const Divider = ({className}) => {
  return (
    <div className={cn("h-[2px] w-full bg-gray-500 dark:bg-gray-400 my-5 rounded", className)}></div>
  )
}

export default Divider