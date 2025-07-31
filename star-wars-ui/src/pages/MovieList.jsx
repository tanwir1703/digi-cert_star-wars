import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchMovies,
    setSortKey,
    clearErrors,
    selectSortedMovies,
    selectMoviesLoading,
    selectMoviesError,
    selectSortConfig,
    selectMoviesStats
} from '../redux/features/movies/movieSlice';
import Table from '../components/Table';
import ErrorMessage from '../components/ErrorMessage';
import Badge from '../components/Badge';
import Card from '../components/Card';
import MovieService from '../redux/features/movies/movieService';
import {
    Calendar,
    User,
    Film,
    Star,
    Users,
    Globe,
    Rocket,
    Bug,
    ArrowLeft,
    Play,
    Clock,
    Award,
    Sparkles,
    Eye,
    ChevronDown,
    Filter,
    Search,
    RefreshCw,
    ExternalLink,
    Info
} from 'lucide-react';

// Enhanced Stats Component with animations and better visual hierarchy
function MovieStats({ movies }) {
    if (!movies || movies.length === 0) return null;

    const totalCharacters = movies.reduce((sum, movie) => sum + (movie.characters?.length || 0), 0);
    const totalPlanets = movies.reduce((sum, movie) => sum + (movie.planets?.length || 0), 0);
    const totalStarships = movies.reduce((sum, movie) => sum + (movie.starships?.length || 0), 0);
    const totalSpecies = movies.reduce((sum, movie) => sum + (movie.species?.length || 0), 0);
    const totalVehicles = movies.reduce((sum, movie) => sum + (movie.vehicles?.length || 0), 0);

    const uniqueDirectors = [...new Set(movies.map(m => m.director))].length;
    const avgRating = movies.reduce((sum, movie) => sum + (movie.rating || 8.5), 0) / movies.length;

    const stats = [
        {
            icon: Film,
            label: 'Episodes',
            value: movies.length,
            gradient: 'from-blue-600 to-cyan-500',
            description: 'Total movies'
        },
        {
            icon: Users,
            label: 'Characters',
            value: totalCharacters,
            gradient: 'from-emerald-600 to-teal-500',
            description: 'Across all films'
        },
        {
            icon: Globe,
            label: 'Planets',
            value: totalPlanets,
            gradient: 'from-purple-600 to-pink-500',
            description: 'Known worlds'
        },
        {
            icon: Rocket,
            label: 'Starships',
            value: totalStarships,
            gradient: 'from-red-600 to-orange-500',
            description: 'Vessels featured'
        },
        {
            icon: Bug,
            label: 'Species',
            value: totalSpecies,
            gradient: 'from-amber-600 to-yellow-500',
            description: 'Life forms'
        },
        {
            icon: User,
            label: 'Directors',
            value: uniqueDirectors,
            gradient: 'from-indigo-600 to-blue-500',
            description: 'Visionaries'
        },
    ];

    return (
        <div className="mb-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Galaxy Statistics</h2>
                <p className="text-gray-600">Comprehensive data from a galaxy far, far away...</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-gray-900 group-hover:scale-110 transition-transform duration-300">
                                            {stat.value.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg mb-1">{stat.label}</h3>
                                    <p className="text-sm text-gray-500">{stat.description}</p>
                                </div>
                            </div>

                            {/* Hover Effect Border */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Enhanced Movie Detail Modal with cinematic design
function MovieDetailModal({ movie, isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('overview');

    if (!isOpen || !movie) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const formatOpeningCrawl = (text) => {
        if (!text) return [];
        return text.split('\r\n').filter(line => line.trim());
    };

    const getEpisodeRomanNumeral = (episode) => {
        const numerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
        return numerals[episode] || episode;
    };

    const releaseYear = new Date(movie.release_date).getFullYear();
    const crawlLines = formatOpeningCrawl(movie.opening_crawl);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'universe', label: 'Universe', icon: Globe },
        { id: 'production', label: 'Production', icon: Film }
    ];

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                {/* Cinematic Header */}
                <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
                    {/* Animated Background */}
                    <div
                        className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse`}
                    ></div>


                    <div className="relative z-10 p-8">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                {/* Episode Badge and Year */}
                                <div className="flex items-center gap-4 mb-4">
                                    <Badge
                                        variant="secondary"
                                        size="lg"
                                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 text-lg shadow-lg"
                                    >
                                        Episode {getEpisodeRomanNumeral(movie.episode_id)}
                                    </Badge>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <Calendar className="h-4 w-4" />
                                        <span className="font-medium">{releaseYear}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                                    {movie.title}
                                </h2>

                                {/* Meta Info */}
                                <div className="flex flex-wrap items-center gap-6 text-white/90">
                                    <div className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        <span className="font-medium">Directed by {movie.director}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        <span className="font-medium">Produced by {movie.producer}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        <span className="font-medium">{MovieService.formatReleaseDate(movie.release_date)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                                aria-label="Close modal"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-2xl" />
                </div>

                {/* Tab Navigation */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="flex">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${activeTab === tab.id
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="overflow-y-auto max-h-[calc(95vh-280px)] p-8">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Opening Crawl */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <Sparkles className="h-6 w-6 text-yellow-500" />
                                    Opening Crawl
                                </h3>
                                {crawlLines.length > 0 ? (
                                    <div className="relative">
                                        <div className="bg-gradient-to-b from-black via-gray-900 to-black text-yellow-300 p-10 rounded-3xl font-mono text-lg leading-relaxed shadow-2xl border-4 border-yellow-400/20">
                                            <div className="space-y-6 text-center">
                                                {crawlLines.map((paragraph, index) => (
                                                    <p key={index} className="leading-relaxed tracking-wide">
                                                        {paragraph}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Cinematic glow effect */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/50 to-orange-500/50 rounded-3xl blur opacity-30 -z-10" />
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 rounded-3xl p-12 text-center">
                                        <Film className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg italic">Opening crawl not available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'universe' && (
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <Globe className="h-6 w-6 text-blue-500" />
                                Universe Statistics
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    {
                                        icon: Users,
                                        label: 'Characters',
                                        value: movie.characters?.length || 0,
                                        gradient: 'from-blue-500 to-cyan-400',
                                        description: 'Featured characters'
                                    },
                                    {
                                        icon: Globe,
                                        label: 'Planets',
                                        value: movie.planets?.length || 0,
                                        gradient: 'from-green-500 to-emerald-400',
                                        description: 'Worlds explored'
                                    },
                                    {
                                        icon: Rocket,
                                        label: 'Starships',
                                        value: movie.starships?.length || 0,
                                        gradient: 'from-purple-500 to-pink-400',
                                        description: 'Vessels featured'
                                    },
                                    {
                                        icon: Bug,
                                        label: 'Species',
                                        value: movie.species?.length || 0,
                                        gradient: 'from-orange-500 to-red-400',
                                        description: 'Life forms'
                                    },
                                ].map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div key={index} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                                            <div className="relative z-10 text-center">
                                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                                                    <Icon className="h-8 w-8 text-white" />
                                                </div>
                                                <div className="text-4xl font-black text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                                                    {stat.value}
                                                </div>
                                                <h4 className="font-bold text-gray-800 text-lg mb-1">{stat.label}</h4>
                                                <p className="text-sm text-gray-500">{stat.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'production' && (
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <Film className="h-6 w-6 text-purple-500" />
                                Production Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <User className="h-5 w-5 text-blue-600" />
                                            <h4 className="font-bold text-gray-800">Director</h4>
                                        </div>
                                        <p className="text-gray-700 text-lg font-medium">{movie.director}</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Award className="h-5 w-5 text-purple-600" />
                                            <h4 className="font-bold text-gray-800">Producer(s)</h4>
                                        </div>
                                        <p className="text-gray-700 text-lg font-medium">{movie.producer}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Calendar className="h-5 w-5 text-green-600" />
                                            <h4 className="font-bold text-gray-800">Release Date</h4>
                                        </div>
                                        <p className="text-gray-700 text-lg font-medium">{MovieService.formatReleaseDate(movie.release_date)}</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Clock className="h-5 w-5 text-orange-600" />
                                            <h4 className="font-bold text-gray-800">Last Updated</h4>
                                        </div>
                                        <p className="text-gray-700 text-lg font-medium">{new Date(movie.edited).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
                                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <ExternalLink className="h-5 w-5" />
                                    Additional Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Episode Order:</span>
                                        <span className="ml-2 font-medium">Episode {movie.episode_id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Vehicles Featured:</span>
                                        <span className="ml-2 font-medium">{movie.vehicles?.length || 0}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Created:</span>
                                        <span className="ml-2 font-medium">{new Date(movie.created).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">SWAPI ID:</span>
                                        <span className="ml-2 font-medium text-blue-600">{movie.url?.split('/').slice(-2, -1)[0]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Loading Skeleton Component
function LoadingSkeleton() {
    return (
        <div className="space-y-8">
            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                            <div className="w-16 h-8 bg-gray-200 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="w-20 h-4 bg-gray-200 rounded" />
                            <div className="w-16 h-3 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-4 p-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function MovieList() {
    const dispatch = useDispatch();
    const movies = useSelector(selectSortedMovies);
    const loading = useSelector(selectMoviesLoading);
    const error = useSelector(selectMoviesError);
    const sortConfig = useSelector(selectSortConfig);
    const stats = useSelector(selectMoviesStats);

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchMovies());
    }, [dispatch]);

    const handleSort = (key) => {
        const ascending = sortConfig.key === key ? !sortConfig.ascending : true;
        dispatch(setSortKey({ key, ascending }));
    };

    const handleRowClick = (movie) => {
        setSelectedMovie(movie);
    };

    const handleRetry = () => {
        dispatch(clearErrors());
        dispatch(fetchMovies());
    };

    const closeModal = () => {
        setSelectedMovie(null);
    };

    const getEpisodeRomanNumeral = (episode) => {
        const numerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
        return numerals[episode] || episode;
    };

    // Filter movies based on search term
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Enhanced table column configuration
    const columns = [
        {
            key: 'episode_id',
            label: 'Episode',
            sortable: true,
            render: (value) => (
                <div className="flex items-center gap-2">
                    <Badge
                        variant="primary"
                        size="sm"
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold border-0 shadow-md"
                    >
                        {getEpisodeRomanNumeral(value)}
                    </Badge>
                </div>
            )
        },
        {
            key: 'title',
            label: 'Title',
            sortable: true,
            render: (value, movie) => (
                <div className="group">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-16 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <Film className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                            <span className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                {value}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" size="xs" className="bg-blue-50 text-blue-700">
                                    {new Date(movie.release_date).getFullYear()}
                                </Badge>
                                <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span className="text-xs text-gray-500">8.{movie.episode_id}/10</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'director',
            label: 'Director',
            sortable: true,
            render: (value) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <span className="text-gray-900 font-medium">{value}</span>
                        <div className="text-xs text-gray-500">Director</div>
                    </div>
                </div>
            )
        },
        {
            key: 'characters',
            label: 'Universe',
            sortable: false,
            render: (value, movie) => (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" size="xs" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Users className="h-3 w-3 mr-1" />
                            {movie.characters?.length || 0}
                        </Badge>
                        <Badge variant="secondary" size="xs" className="bg-green-50 text-green-700 border-green-200">
                            <Globe className="h-3 w-3 mr-1" />
                            {movie.planets?.length || 0}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" size="xs" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Rocket className="h-3 w-3 mr-1" />
                            {movie.starships?.length || 0}
                        </Badge>
                        <Badge variant="secondary" size="xs" className="bg-orange-50 text-orange-700 border-orange-200">
                            <Bug className="h-3 w-3 mr-1" />
                            {movie.species?.length || 0}
                        </Badge>
                    </div>
                </div>
            )
        },
        {
            key: 'release_date',
            label: 'Released',
            sortable: true,
            render: (value) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                        <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <span className="text-gray-900 font-medium">
                            {MovieService.formatReleaseDate(value)}
                        </span>
                        <div className="text-xs text-gray-500">Theatrical Release</div>
                    </div>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <LoadingSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
                {/* Enhanced Header with Hero Section */}
                <div className="text-center mb-16">
                    <div className="relative inline-block mb-8">
                        {/* Glowing effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30 animate-pulse" />

                        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-center gap-4">
                                <div className="relative">
                                    <Film className="h-12 w-12 text-yellow-300" />
                                    <div className="absolute inset-0 bg-yellow-300 rounded-full blur-md opacity-50 animate-ping" />
                                </div>
                                <div className="text-left">
                                    <h1 className="text-5xl md:text-6xl font-black text-white mb-2">
                                        STAR WARS
                                    </h1>
                                    <p className="text-xl text-blue-100 font-medium">Database</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed mb-8">
                        Explore the complete Star Wars saga with detailed information about each movie,
                        characters, planets, and the entire universe. May the Force be with you.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search movies or directors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg"
                            />
                        </div>
                    </div>

                    {/* Last Updated Info */}
                    {stats.lastFetched && (
                        <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full text-sm text-gray-600 border border-white/40 shadow-lg">
                            <div className="relative">
                                <div className="w-3 h-3 bg-green-500 rounded-full" />
                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                            </div>
                            <span className="font-medium">
                                Last updated: {new Date(stats.lastFetched).toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Stats Overview */}
                <MovieStats movies={movies} />

                {/* Error Message */}
                {error && (
                    <div className="mb-8">
                        <ErrorMessage
                            error={error}
                            onRetry={handleRetry}
                            className="bg-red-50 border-red-200 text-red-800 rounded-2xl p-6 shadow-lg"
                        />
                    </div>
                )}

                {/* Enhanced Movies Table */}
                <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden rounded-3xl">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                                        <Star className="h-7 w-7 text-white" />
                                    </div>
                                    Movie Collection
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found
                                    {searchTerm && ` for "${searchTerm}"`}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleRetry}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-sm disabled:opacity-50"
                                >
                                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                    <span className="hidden sm:inline">Refresh</span>
                                </button>

                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-300 shadow-sm">
                                    <Filter className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 hidden sm:inline">
                                        Sort: {sortConfig.key || 'episode_id'}
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2">
                        <Table
                            columns={columns}
                            data={filteredMovies}
                            sortKey={sortConfig.key}
                            sortAscending={sortConfig.ascending}
                            onSort={handleSort}
                            onRowClick={handleRowClick}
                            loading={loading}
                            emptyMessage={
                                <div className="text-center py-16">
                                    <div className="relative inline-block mb-6">
                                        <Film className="h-20 w-20 text-gray-300 mx-auto" />
                                        <div className="absolute inset-0 bg-gray-300 rounded-full blur-lg opacity-20 animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-600 mb-2">
                                        {searchTerm ? 'No matches found' : 'No movies available'}
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        {searchTerm
                                            ? `No movies match "${searchTerm}". Try adjusting your search terms.`
                                            : 'The Force seems to be offline... Try refreshing the page.'
                                        }
                                    </p>
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            }
                            className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer rounded-2xl"
                        />
                    </div>
                </Card>

                {/* Enhanced Movie Detail Modal */}
                <MovieDetailModal
                    movie={selectedMovie}
                    isOpen={!!selectedMovie}
                    onClose={closeModal}
                />

                {/* Footer */}
                <footer className="mt-20 text-center py-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <Film className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-800">Star Wars Database</h3>
                            <p className="text-sm text-gray-500">Powered by SWAPI</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Data sourced from the Star Wars API. This is a fan-made project.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <span>Made with</span>
                        <span className="text-red-500">♥</span>
                        <span>for Star Wars fans everywhere</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}