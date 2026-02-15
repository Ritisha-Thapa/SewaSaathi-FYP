import { useEffect, useState } from "react";
import ProviderCard from "../../components/customer/providers/ProviderCard";
import DashboardHeader from "../../components/customer/DashboardHeader";
import Footer from "../../components/customer/Footer";

const ProvidersPage = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters state
    const [skill, setSkill] = useState("");
    const [city, setCity] = useState("");

    const SKILLS = ['plumber', 'electrician', 'cleaner', 'painter', 'gardener']; // Match backend choices

    useEffect(() => {
        const fetchProviders = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (skill) params.append("skills", skill);
                if (city) params.append("city", city);

                const url = `http://127.0.0.1:8000/accounts/providers/?${params.toString()}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch providers");
                const data = await res.json();
                setProviders(data);
            } catch (err) {
                console.error(err);
                setProviders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, [skill, city]);

    return (
        <div className="min-h-screen bg-[#F9F5F0]">
            <DashboardHeader />
            <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-24">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-[#1B3C53]">Filters</h3>
                        <button
                            onClick={() => { setSkill(""); setCity(""); }}
                            className="text-sm text-red-500 hover:text-red-700 font-medium"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Skill Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <div className="space-y-2">
                            {SKILLS.map((s) => (
                                <label key={s} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="skill"
                                        checked={skill === s}
                                        onChange={() => setSkill(s)}
                                        className="w-4 h-4 text-[#1B3C53] border-gray-300 focus:ring-[#1B3C53]"
                                    />
                                    <span className="text-gray-600 group-hover:text-[#1B3C53] capitalize">{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* City Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city..."
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B3C53]"
                        />
                    </div>
                </div>

                {/* Providers Grid */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {loading ? (
                        <p>Loading providers...</p>
                    ) : providers.length === 0 ? (
                        <p>No providers found.</p>
                    ) : (
                        providers.map((provider) => (
                            <ProviderCard key={provider.id} provider={provider} />
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProvidersPage;
