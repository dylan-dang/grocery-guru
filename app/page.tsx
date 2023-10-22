import { SearchForm } from './SearchBar';
import 'dotenv/config';

export default function Home() {
    return (
        <>
            <main className='font-playpen text-white flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#4dff73e6] to-[#15162c]'>
                <div className='flex items-center'>
                    <img src="/groceryGuruLogo.png" alt="Grocery Guru" className="w-16 h-16 mr-4 rounded-lg" />
                    <h1 className='text-6xl font-pacifico'>Grocery Guru</h1>
                </div>
                <h2 className='mt-8 text-xl text-center'>
                    Your one-stop shop to compare and find the best grocery deals around you!
                </h2>
                <SearchForm />
            </main>
        </>
    );
}
