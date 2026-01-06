'use client';
import { useRouter } from 'next/navigation';
export default function Navbar() {
    const router = useRouter();

    const handleStarredPostsClick = () => {
        router.push('/favorites');
    };
  return (
     <div className="fixed top-2 right-2 z-10">
        <div className="flex flex-row">
            <button
                onClick={handleStarredPostsClick}
                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-medium shadow-sm"
            >
                starred posts
            </button>
        </div>
     </div>
  );
}