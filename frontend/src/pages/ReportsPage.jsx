import {Users, BarChart3, Clock, CalendarDays } from 'lucide-react';
import BaseLayout from '../layouts/BaseLayout.jsx';
import Header from '../components/Header.jsx';

function ReportsPage({ onPageChange}) {
    //TODO: buscar estatísticas pelo backend fetch ou axios

    // dados modelo
    const reportCards = [
        { title: 'Employees', value: '', icon: Users},
        { title: 'Generated Scales', value: 'XX', icon: CalendarDays}
    ];

    const handleCard = (card) => {
        if (card.title === 'Generated Scales') {
            onPageChange(8);
        }
    }

    return (
        <BaseLayout currentPage={3} onPageChange={onPageChange}>
            <Header title="Reports and Analysis" icon={BarChart3} />

            <div className="flex gap-4 flex-wrap">
                {reportCards.map((card, idx) => {
                    const Icon = card.icon
                    return (
                        <div
                            onClick={() => handleCard(card)}
                            key={idx}
                            className="bg-slate-800 rounded-lg p-6 w-64 border border-slate-700 hover:border-indigo-500 transition-all duration-200 overflow-hidden cursor-pointer"
                        >
                            <Icon size={40} className="text-blue-400 mb-4" />
                            <p className="text-4xl font-bold text-slate-400 mb-2">{card.value}</p>
                            <p className="text-sm text-slate-500">{card.title}</p>
                        </div>
                    );
                })}
            </div>
        </BaseLayout>
    );
}

export default ReportsPage;