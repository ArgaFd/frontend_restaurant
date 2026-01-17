import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
              404 error
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Halaman tidak ditemukan
            </h1>
            <p className="mt-2 text-base text-gray-500">
              Maaf, kami tidak dapat menemukan halaman yang Anda cari.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="text-base font-medium text-primary-600 hover:text-primary-500"
              >
                Kembali ke beranda<span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <nav className="flex justify-center space-x-4">
          <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Beranda
          </Link>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <Link to="/menu" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Menu
          </Link>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <Link to="/contact" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Kontak
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default NotFoundPage;
