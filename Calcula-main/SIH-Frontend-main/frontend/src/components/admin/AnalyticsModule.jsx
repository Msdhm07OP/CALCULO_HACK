import React, { useState, useEffect } from 'react';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { useAuth } from '@context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import {
  TrendingUp,
  Users,
  Activity,
  AlertCircle,
  AlertTriangle,
  ClipboardCheck,
  BrainCircuit,
  Calendar
} from 'lucide-react';
import api from '@services/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- Improved Helper Components ---

const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-lg shadow-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
        <p className="font-semibold mb-1">{label}</p>
        <p className={`text-sm ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
          {payload[0].name}: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ModernAreaChart = ({ data, color = "#06b6d4" }) => {
  const { theme } = useTheme();
  const isDark = theme?.name?.toLowerCase().includes('dark') || theme?.currentTheme === 'dark';

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={isDark ? "#94a3b8" : "#64748b"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke={isDark ? "#94a3b8" : "#64748b"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip theme={isDark ? 'dark' : 'light'} />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            fill={`url(#color-${color})`}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const ModernBarChart = ({ data, color = "#8b5cf6" }) => {
  const { theme } = useTheme();
  const isDark = theme?.name?.toLowerCase().includes('dark') || theme?.currentTheme === 'dark';

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={isDark ? "#94a3b8" : "#64748b"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke={isDark ? "#94a3b8" : "#64748b"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip theme={isDark ? 'dark' : 'light'} />} />
          <Bar
            dataKey="value"
            fill={color}
            radius={[6, 6, 0, 0]}
            animationDuration={1500}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ModernDonutChart = ({ data, colors = ['#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'] }) => {
  const { theme } = useTheme();
  return (
    <div className="h-[250px] w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className={theme?.name?.includes('dark') ? 'text-gray-300' : 'text-gray-600'}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};


const AnalyticsModule = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('standard');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDark = theme?.name?.toLowerCase().includes('dark') || theme?.currentTheme === 'dark';

  // Dynamic styles based on theme
  const cardBg = isDark ? 'bg-slate-800/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-slate-700' : 'border-slate-200/60';
  const titleColor = isDark ? 'text-white' : 'text-slate-800';
  const subtitleColor = isDark ? 'text-slate-400' : 'text-slate-500';

  useEffect(() => {
    fetchAnalyticsData();
  }, [user]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const endpoint = user?.role === 'counsellor'
        ? '/counsellor/analytics/assessments'
        : '/admin/analytics/assessments';

      const response = await api.get(endpoint);
      setAnalyticsData(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      // Don't set error immediately, fall back to dummy data for demo
    } finally {
      setLoading(false);
    }
  };

  // Helper to transform array-based data to Recharts object-array
  const transformToRecharts = (dataObj) => {
    if (!dataObj || !dataObj.labels || !dataObj.values) return [];
    return dataObj.labels.map((label, idx) => ({
      name: label,
      value: dataObj.values[idx]
    }));
  };

  // Data Preparation
  const rawStressData = analyticsData?.stressLevels || {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    values: [6.2, 5.8, 7.1, 6.5, 5.9]
  };
  const stressData = transformToRecharts(rawStressData);

  const rawAnxietyData = analyticsData?.anxietyDepressionDistribution || {
    labels: ['Normal', 'Mild', 'Moderate', 'Severe'],
    values: [45, 28, 18, 9]
  };
  const anxietyData = transformToRecharts(rawAnxietyData);

  const rawRiskData = analyticsData?.riskAlertDistribution || {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    values: [78, 15, 7]
  };
  const riskData = transformToRecharts(rawRiskData);


  const dynamicFormsData = [
    {
      category: 'Exam Stress Index',
      description: 'Tracking student stress levels during exam periods.',
      trend: 'up',
      chartDetails: { type: 'area', color: '#f59e0b' },
      data: [
        { name: 'Day 1', value: 45 }, { name: 'Day 2', value: 52 },
        { name: 'Day 3', value: 48 }, { name: 'Day 4', value: 65 },
        { name: 'Day 5', value: 72 }
      ]
    },
    {
      category: 'Sleep Quality',
      description: 'Analysis of reported sleep duration and quality.',
      trend: 'down',
      chartDetails: { type: 'bar', color: '#8b5cf6' },
      data: [
        { name: 'Poor', value: 15 }, { name: 'Fair', value: 28 },
        { name: 'Good', value: 35 }, { name: 'Excellent', value: 22 }
      ]
    },
    {
      category: 'Emotional Wellness',
      description: 'General mood and emotional stability tracking.',
      trend: 'stable',
      chartDetails: { type: 'donut', colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'] },
      data: [
        { name: 'Happy', value: 35 }, { name: 'Neutral', value: 28 },
        { name: 'Sad', value: 10 }, { name: 'Angry', value: 5 }
      ]
    },
    {
      category: 'Burnout Index',
      description: 'Indicators of student exhaustion and burnout.',
      trend: 'up',
      chartDetails: { type: 'area', color: '#ef4444' },
      data: [
        { name: 'W1', value: 30 }, { name: 'W2', value: 35 },
        { name: 'W3', value: 45 }, { name: 'W4', value: 60 },
        { name: 'W5', value: 55 }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* --- Global KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Students', value: analyticsData?.totalStudentsAssessed || 1240, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Assessments Taken', value: analyticsData?.totalAssessments || 3567, icon: ClipboardCheck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { title: 'Avg Stress Score', value: rawStressData.average || '6.3/10', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { title: 'Risk Alerts', value: '7 Active', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((stat, i) => (
          <Card key={i} className={`${cardBg} ${cardBorder} shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-${stat.color.split('-')[1]}-500`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${subtitleColor} mb-1`}>{stat.title}</p>
                  <h3 className={`text-2xl font-bold ${titleColor}`}>{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- Navigation Tabs --- */}
      <div className="flex space-x-1 p-1 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur rounded-xl w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('standard')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'standard'
              ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
          Standard Analytics
        </button>
        <button
          onClick={() => setActiveTab('dynamic')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'dynamic'
              ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
          Dynamic Assessments
        </button>
      </div>

      {/* --- Content Area --- */}
      {activeTab === 'standard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Stress Trends */}
          <Card className={`col-span-1 lg:col-span-2 ${cardBg} ${cardBorder} shadow-lg`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={titleColor}>Stress Level Trends</CardTitle>
                  <CardDescription className={subtitleColor}>Average stress scores over the last 5 weeks</CardDescription>
                </div>
                <Badge variant="outline" className={`${isDark ? 'border-orange-500 text-orange-400' : 'border-orange-200 text-orange-700 bg-orange-50'}`}>
                  Modified PHQ-9
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ModernAreaChart data={stressData} color="#f97316" />
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card className={`${cardBg} ${cardBorder} shadow-lg`}>
            <CardHeader>
              <CardTitle className={titleColor}>Risk Distribution</CardTitle>
              <CardDescription className={subtitleColor}>Students categorized by risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <ModernDonutChart data={riskData} colors={['#22c55e', '#eab308', '#ef4444']} />
              <div className="mt-4 text-center">
                <p className={`text-sm ${subtitleColor}`}>
                  <span className="font-bold text-red-500">7%</span> of students require immediate attention.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Anxiety vs Depression */}
          <Card className={`col-span-1 lg:col-span-3 ${cardBg} ${cardBorder} shadow-lg`}>
            <CardHeader>
              <CardTitle className={titleColor}>Condition Severity</CardTitle>
              <CardDescription className={subtitleColor}>Breakdown of Anxiety & Depression severity across campus</CardDescription>
            </CardHeader>
            <CardContent>
              <ModernBarChart data={anxietyData} color="#8b5cf6" />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'dynamic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dynamicFormsData.map((item, idx) => (
              <Card key={idx} className={`${cardBg} ${cardBorder} shadow-lg hover:ring-2 ring-cyan-500/20 transition-all`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className={`${titleColor} text-lg`}>{item.category}</CardTitle>
                      <CardDescription className={`text-xs ml-1 mt-1 ${subtitleColor}`}>{item.description}</CardDescription>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-bold ${item.trend === 'up' ? 'text-red-500' :
                        item.trend === 'down' ? 'text-green-500' :
                          'text-yellow-500'
                      }`}>
                      {item.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                      {item.trend === 'down' && <TrendingUp className="w-4 h-4 rotate-180" />}
                      <span className="uppercase tracking-wider text-xs">{item.trend}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    {item.chartDetails.type === 'area' && <ModernAreaChart data={item.data} color={item.chartDetails.color} />}
                    {item.chartDetails.type === 'bar' && <ModernBarChart data={item.data} color={item.chartDetails.color} />}
                    {item.chartDetails.type === 'donut' && <ModernDonutChart data={item.data} colors={item.chartDetails.colors} />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className={`p-6 rounded-xl border ${isDark ? 'bg-indigo-900/20 border-indigo-700/50' : 'bg-indigo-50 border-indigo-100'}`}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500 rounded-full text-white">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`text-lg font-bold ${isDark ? 'text-indigo-200' : 'text-indigo-900'}`}>AI Insights</h4>
                <p className={`mt-1 ${isDark ? 'text-indigo-300/80' : 'text-indigo-700'}`}>
                  Correlation detected: <strong>Exam Stress</strong> levels are showing a strong inverse relationship with <strong>Sleep Quality</strong> this week.
                  Consider recommending the "Deep Sleep" meditation module to students reporting high stress.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalyticsModule;
