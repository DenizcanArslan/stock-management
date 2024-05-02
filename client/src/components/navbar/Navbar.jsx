import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
    <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-semibold">STOK YONETIMI</h1>
        <div className="space-x-4">
        <Link href="/" className="text-white hover:text-gray-300">
                Anasayfa
            </Link>
        <Link href="/karZarar" className="text-white hover:text-gray-300">
                Kar/Zarar
            </Link>
            <Link href="/malKabul" className="text-white hover:text-gray-300">
                Mal Kabul
            </Link>
            <Link href="/malSatis" className="text-white hover:text-gray-300">
               Mal Satis
            </Link>
        </div>
    </div>
</nav>
  )
}

export default Navbar