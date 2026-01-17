import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { getAvailableAssessments } from '@services/assessmentService';
import { Loader, WifiOff, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '@context/LanguageContext';

const ActiveTasks = ({ theme, onStartAssessment }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { t } = useLanguage();

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (isOnline) {
            loadTasks();
        } else {
            setLoading(false);
        }
    }, [isOnline]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const result = await getAvailableAssessments(); // Returns { assessments, total }
            // Filter for Dynamic Assessments only
            const dynamicTasks = (result.assessments || []).filter(a => a.isDynamic);
            setTasks(dynamicTasks);
        } catch (error) {
            console.error("Failed to load active tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOnline) {
        return (
            <Card className={`${theme.colors.card} border-dashed border-2 border-gray-300 dark:border-gray-700`}>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                        <WifiOff className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                        <h3 className={`font-semibold ${theme.colors.text}`}>You are offline</h3>
                        <p className={`text-sm ${theme.colors.muted}`}>
                            Connect to the internet to check for new tasks and surveys.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card className={`${theme.colors.card}`}>
                <CardContent className="flex justify-center py-8">
                    <Loader className="w-8 h-8 animate-spin text-cyan-500" />
                </CardContent>
            </Card>
        );
    }

    if (tasks.length === 0) {
        return null; // Don't show section if no tasks (or show empty state?)
        // Requirement says "Active forms appear...", implied distinction.
        // If empty, cleaner to hide or show "No new tasks". Let's hide for minimal noise.
    }

    return (
        <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${theme.colors.text}`}>New Tasks</h2>
                <Badge variant="outline" className="animate-pulse bg-cyan-100 text-cyan-800">
                    {tasks.length} Active
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map(task => (
                    <Card key={task.id} className={`${theme.colors.card} hover:shadow-lg transition-all border-l-4 border-l-cyan-500`}>
                        <CardContent className="p-5 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-semibold text-lg line-clamp-1 ${theme.colors.text}`}>{task.name}</h3>
                                    {task.validUntil && (
                                        <Badge variant="secondary" className="text-xs shrink-0 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(task.validUntil).getHours() - new Date().getHours() > 0
                                                ? `${Math.ceil((new Date(task.validUntil) - new Date()) / (1000 * 60 * 60))}h left`
                                                : 'Expiring soon'}
                                        </Badge>
                                    )}
                                </div>
                                <p className={`text-sm ${theme.colors.muted} line-clamp-2`}>
                                    {task.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className={`text-xs ${theme.colors.muted}`}>
                                    {task.questions} Questions • {task.duration}
                                </span>
                                <Button
                                    size="sm"
                                    onClick={() => onStartAssessment(task)}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:scale-105 transition-transform"
                                >
                                    Start <ArrowRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ActiveTasks;
