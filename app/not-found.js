import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <h2 className='text-8xl'>Not Found</h2> 
      <p className='text-5xl'>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}