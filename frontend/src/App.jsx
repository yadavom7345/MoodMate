import React, { useState, useEffect, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    BookHeart,
    LogOut,
    Plus,
    Search,
    TrendingUp,
    Smile,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, subDays, isAfter, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';

// --- Utility ---
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

import config from './config';

// --- API Calls ---
const API_URL = config.API_URL;

// Helper to get token
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

async function fetchEntries() {
    try {
        const response = await fetch(`${API_URL}/entries`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch entries');
        return await response.json();
    } catch (error) {
        console.error("Fetch entries failed:", error);
        return [];
    }
}

async function createEntry(text) {
    try {
        const response = await fetch(`${API_URL}/entries`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ text })
        });
        if (!response.ok) throw new Error('Failed to create entry');
        return await response.json();
    } catch (error) {
        console.error("Create entry failed:", error);
        throw error;
    }
}

async function semanticSearch(queryText, entries) {
    try {
        const response = await fetch(`${API_URL}/ai/search`, {
            method: 'POST',
            headers: getHeaders(), // Protected route? Maybe not needed if AI route is public, but let's send it.
            body: JSON.stringify({ query: queryText, entries })
        });
        return await response.json();
    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}

// --- Helpers ---
const getMoodEmoji = (score) => {
    if (score >= 9) return '🤩';
    if (score >= 7) return '🙂';
    if (score >= 5) return '😐';
    if (score >= 3) return '😔';
    return '😭';
};

// --- Components ---
const Button = ({ className, variant = 'primary', ...props }) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl hover:-translate-y-0.5',
        secondary: 'bg-white text-dark border-2 border-slate-100 hover:border-primary/20 hover:bg-cream',
        ghost: 'text-slate-500 hover:bg-slate-100 hover:text-primary'
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={cn(
                'px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                variants[variant],
                className
            )}
            {...props}
        />
    );
};

const Card = ({ children, className, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("glass-card p-8", className)}
        onClick={onClick}
    >
        {children}
    </motion.div>
);

const EntryModal = ({ entry, onClose }) => {
    if (!entry) return null;

    return (
        <AnimatePresence>
            {entry && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
                    >
                        <div className="bg-white w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl shadow-2xl pointer-events-auto p-8 border border-white/50">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg text-2xl",
                                        entry.moodScore >= 8 ? "bg-secondary shadow-secondary/30" :
                                            entry.moodScore >= 4 ? "bg-primary-light shadow-primary-light/30" : "bg-rose-400 shadow-rose-400/30"
                                    )}>
                                        {getMoodEmoji(entry.moodScore)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-dark text-xl">
                                            {entry.createdAt ? format(new Date(entry.createdAt), 'PPP') : 'Just now'}
                                        </div>
                                        <div className="text-sm font-medium text-slate-400">
                                            {entry.createdAt ? format(new Date(entry.createdAt), 'p') : ''}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <LogOut className="rotate-45 text-slate-400" size={24} />
                                </button>
                            </div>

                            <div className="prose prose-slate max-w-none mb-8">
                                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                                    {entry.text}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100">
                                {entry.tags.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-slate-50 text-slate-600 text-sm font-semibold rounded-full border border-slate-100">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

function App() {
    const { user, loading: authLoading, logout } = useAuth();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('dashboard');
    const [selectedEntry, setSelectedEntry] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [moodFilter, setMoodFilter] = useState('all');
    const [chartRange, setChartRange] = useState('week');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const [isSearchingAI, setIsSearchingAI] = useState(false);
    const [aiFilteredIds, setAiFilteredIds] = useState(null);

    const [entryText, setEntryText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Load Entries
    useEffect(() => {
        if (!user) return;
        setLoading(true);
        fetchEntries().then(data => {
            setEntries(data);
            setLoading(false);
        });
    }, [user]);

    // AI Search Debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 3) {
                setIsSearchingAI(true);
                const ids = await semanticSearch(searchQuery, entries);
                setAiFilteredIds(ids);
                setIsSearchingAI(false);
            } else {
                setAiFilteredIds(null);
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [searchQuery, entries]);


    const { chartData, chartDomain } = useMemo(() => {
        const now = new Date();
        let startDate = subDays(now, 7);

        if (chartRange === 'month') startDate = subDays(now, 30);
        if (chartRange === 'year') startDate = subDays(now, 365);

        const data = entries
            .filter(entry => {
                if (!entry.createdAt) return false;
                return isAfter(new Date(entry.createdAt), startDate);
            })
            .map(entry => ({
                ...entry,
                timestamp: new Date(entry.createdAt).getTime(),
                fullDate: format(new Date(entry.createdAt), 'PPP'),
            }))
            .sort((a, b) => a.timestamp - b.timestamp);

        return {
            chartData: data,
            chartDomain: [startDate.getTime(), now.getTime()]
        };
    }, [entries, chartRange]);

    const suggestion = useMemo(() => {
        const highMoodEntries = entries.filter(e => e.moodScore >= 8);
        if (highMoodEntries.length === 0) return "Journaling regularly has been shown to reduce stress and improve immune function. Keep going!";

        const tagCounts = {};
        highMoodEntries.forEach(e => {
            e.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        const bestTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
        if (!bestTag) return "Reflecting on positive moments helps rewire your brain for happiness.";

        return `Based on your history, doing "${bestTag[0]}" tends to improve your mood.`;
    }, [entries]);

    const todaysEntry = useMemo(() => {
        if (entries.length > 0) {
            const latestEntry = entries[0];
            if (latestEntry.createdAt && isSameDay(new Date(latestEntry.createdAt), new Date())) {
                return latestEntry;
            }
        }
        return null;
    }, [entries]);

    const filteredEntries = useMemo(() => {
        const entriesToFilter = todaysEntry ? entries.slice(1) : entries;

        return entriesToFilter.filter(entry => {
            if (aiFilteredIds !== null) {
                if (!aiFilteredIds.includes(entry._id)) return false; // MongoDB uses _id
            }
            else {
                const matchesKeyword = entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
                if (searchQuery && !matchesKeyword) return false;
            }

            let matchesMood = true;
            if (moodFilter === 'happy') matchesMood = entry.moodScore >= 8;
            else if (moodFilter === 'neutral') matchesMood = entry.moodScore >= 4 && entry.moodScore < 8;
            else if (moodFilter === 'sad') matchesMood = entry.moodScore < 4;

            return matchesMood;
        });
    }, [entries, searchQuery, moodFilter, aiFilteredIds, todaysEntry]);

    const paginatedEntries = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredEntries.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredEntries, currentPage]);

    const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);

    const handleSaveEntry = async () => {
        if (!entryText.trim() || !user) return;
        setIsAnalyzing(true);

        try {
            const newEntry = await createEntry(entryText);
            setEntries([newEntry, ...entries]);
            setEntryText('');
            setView('dashboard');
        } catch (error) {
            console.error("Error saving entry:", error);
            alert("Failed to save entry. Check console.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-cream"><div className="animate-spin text-primary"><Activity size={32} /></div></div>;
    if (!user) return <Login />;

    return (
        <div className="min-h-screen bg-cream text-dark font-sans pb-20 selection:bg-primary-light/30">
            <header className="sticky top-0 z-20 glass">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="bg-white p-2 rounded-2xl shadow-sm">
                            <BookHeart className="fill-current" size={24} />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-dark">MoodMate</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Welcome back</span>
                            <span className="text-sm font-bold text-dark">{user.name}</span>
                        </div>
                        <Button variant="ghost" onClick={logout} className="p-3 rounded-2xl">
                            <LogOut size={20} />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
                <div className="flex justify-between items-center">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-dark"
                    >
                        {view === 'dashboard' ? 'Dashboard' : 'New Entry'}
                    </motion.h1>
                    {view === 'dashboard' && (
                        <Button onClick={() => setView('write')}>
                            <Plus size={20} />
                            Write Entry
                        </Button>
                    )}
                    {view === 'write' && (
                        <Button variant="secondary" onClick={() => setView('dashboard')}>
                            Cancel
                        </Button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {view === 'write' ? (
                        <motion.div
                            key="write"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto space-y-6"
                        >
                            <Card>
                                <label className="block text-lg font-semibold text-slate-600 mb-4">How are you feeling today?</label>
                                <textarea
                                    className="w-full h-64 p-6 glass-input text-xl leading-relaxed resize-none"
                                    placeholder="Dear diary, today I..."
                                    value={entryText}
                                    onChange={e => setEntryText(e.target.value)}
                                    autoFocus
                                />
                                <div className="mt-6 flex justify-end">
                                    <Button onClick={handleSaveEntry} disabled={isAnalyzing || !entryText.trim()} className="w-full sm:w-auto">
                                        {isAnalyzing ? (
                                            <>
                                                <Sparkles className="animate-spin" size={20} /> Analyzing...
                                            </>
                                        ) : (
                                            <>Save Entry</>
                                        )}
                                    </Button>
                                </div>
                            </Card>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/50 border border-white/60 text-indigo-900 p-6 rounded-3xl text-sm flex gap-4 items-center shadow-sm"
                            >
                                <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                                    <Sparkles size={20} />
                                </div>
                                <p className="font-medium">Our AI will automatically analyze your mood and extract key topics from your writing.</p>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <Card className="h-full">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="font-bold text-xl text-dark flex items-center gap-3">
                                                <div className="bg-orange-100 p-2 rounded-xl text-primary">
                                                    <TrendingUp size={20} />
                                                </div>
                                                Mood Trends
                                            </h3>
                                            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl">
                                                {['week', 'month', 'year'].map(range => (
                                                    <button
                                                        key={range}
                                                        onClick={() => setChartRange(range)}
                                                        className={cn(
                                                            "px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all duration-300",
                                                            chartRange === range
                                                                ? "bg-white text-primary shadow-md scale-105"
                                                                : "text-slate-400 hover:text-slate-600"
                                                        )}
                                                    >
                                                        {range}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="h-72 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                    <XAxis
                                                        dataKey="timestamp"
                                                        type="number"
                                                        domain={chartDomain}
                                                        tickFormatter={(time) => format(new Date(time), 'MMM d')}
                                                        stroke="#cbd5e1"
                                                        fontSize={12}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        interval="preserveStartEnd"
                                                        allowDataOverflow={true}
                                                        dy={10}
                                                    />
                                                    <YAxis
                                                        domain={[0, 10]}
                                                        hide
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                                        labelFormatter={(label) => format(new Date(label), 'PPP')}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="moodScore"
                                                        stroke="#FF9F1C"
                                                        strokeWidth={4}
                                                        dot={{ fill: '#FF9F1C', strokeWidth: 4, r: 6, stroke: '#fff' }}
                                                        activeDot={{ r: 8, strokeWidth: 0, fill: '#E88D0C' }}
                                                        animationDuration={1000}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>
                                </div>

                                <div className="space-y-8">
                                    {todaysEntry && (
                                        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-xl shadow-indigo-200 relative overflow-hidden group cursor-pointer" onClick={() => setSelectedEntry(todaysEntry)}>
                                            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                            <div className="flex items-center justify-between mb-6 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                                        <Sparkles size={20} className="text-yellow-300" />
                                                    </div>
                                                    <h3 className="font-bold text-lg tracking-wide">Today's Insight</h3>
                                                </div>
                                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/10">
                                                    {format(new Date(), 'MMM d')}
                                                </span>
                                            </div>

                                            <div className="mb-6 relative z-10">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="text-5xl filter drop-shadow-md animate-bounce-slow">
                                                        {getMoodEmoji(todaysEntry.moodScore)}
                                                    </div>
                                                    <div>
                                                        <div className="text-3xl font-bold">{todaysEntry.moodScore}/10</div>
                                                        <div className="text-indigo-100 font-medium text-sm">Mood Score</div>
                                                    </div>
                                                </div>
                                                <p className="text-white/90 line-clamp-3 leading-relaxed font-medium text-lg">
                                                    "{todaysEntry.text}"
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 relative z-10">
                                                {todaysEntry.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-xs font-bold border border-white/10 backdrop-blur-md">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </Card>
                                    )}
                                    <Card className="bg-gradient-to-br from-primary to-primary-dark text-white border-none shadow-primary/30">
                                        <div className="flex items-center gap-3 mb-4 opacity-90">
                                            <div className="bg-white/20 p-2 rounded-xl">
                                                <Sparkles size={20} />
                                            </div>
                                            <h3 className="font-bold text-lg">Mood Insight</h3>
                                        </div>
                                        <p className="text-white/90 leading-relaxed font-medium text-lg">
                                            {suggestion}
                                        </p>
                                    </Card>

                                    <Card>
                                        <h3 className="font-bold text-xl text-dark mb-6">Your Stats</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                                        <BookHeart size={20} />
                                                    </div>
                                                    <span className="font-semibold text-slate-600">Total Entries</span>
                                                </div>
                                                <span className="font-bold text-2xl text-dark">{entries.length}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                                        <Smile size={20} />
                                                    </div>
                                                    <span className="font-semibold text-slate-600">Avg Mood</span>
                                                </div>
                                                <span className="font-bold text-2xl text-dark">
                                                    {entries.length > 0
                                                        ? (entries.reduce((acc, curr) => acc + curr.moodScore, 0) / entries.length).toFixed(1)
                                                        : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search entries (AI enabled)..."
                                            className="w-full pl-12 pr-12 py-3 glass-input"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                        />
                                        {isSearchingAI && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <Sparkles className="animate-spin text-primary" size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                                        {['all', 'happy', 'neutral', 'sad'].map(filter => (
                                            <button
                                                key={filter}
                                                onClick={() => setMoodFilter(filter)}
                                                className={cn(
                                                    "px-4 py-2 rounded-2xl text-sm font-bold capitalize transition-all whitespace-nowrap",
                                                    moodFilter === filter
                                                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                        : "bg-white text-slate-500 hover:bg-slate-50"
                                                )}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {paginatedEntries.map(entry => (
                                        <Card key={entry._id} className="group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm",
                                                    entry.moodScore >= 8 ? "bg-secondary text-white" :
                                                        entry.moodScore >= 4 ? "bg-primary-light text-white" : "bg-rose-100 text-rose-500"
                                                )}>
                                                    {getMoodEmoji(entry.moodScore)}
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                                    {entry.createdAt ? format(new Date(entry.createdAt), 'MMM d') : ''}
                                                </span>
                                            </div>

                                            <p className="text-slate-600 line-clamp-3 mb-4 text-sm leading-relaxed">
                                                {entry.text}
                                            </p>

                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {entry.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded-lg uppercase tracking-wide">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {entry.tags.length > 2 && (
                                                    <span className="text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded-lg">
                                                        +{entry.tags.length - 2}
                                                    </span>
                                                )}
                                            </div>

                                            <Button
                                                variant="secondary"
                                                className="w-full py-2 text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => setSelectedEntry(entry)}
                                            >
                                                Read More
                                            </Button>
                                        </Card>
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-8">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-colors"
                                        >
                                            <ChevronLeft size={20} className="text-slate-600" />
                                        </button>
                                        <span className="px-4 py-2 font-bold text-slate-600">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-colors"
                                        >
                                            <ChevronRight size={20} className="text-slate-600" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <EntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
            </main>
        </div>
    );
}

export default App;
