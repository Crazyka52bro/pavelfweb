export default function MaintenancePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Web je v údržbě</h1>
                <p className="text-gray-600 mb-6">
                    Právě provádíme nezbytnou údržbu webových stránek.
                    Omlouváme se za způsobené nepříjemnosti a děkujeme za pochopení.
                </p>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
                <p className="text-sm text-gray-500 mt-6">
                    Odhadovaný čas návratu: brzy
                </p>
            </div>
        </div>
    );
}
