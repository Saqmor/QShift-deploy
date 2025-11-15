import BaseLayout from '../layouts/BaseLayout';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import {BarChart3} from 'lucide-react';

function EmployeeReportsPage({
    onPageChange,
    isLoading,
    setLoading
}) {
    return (
        <BaseLayout 
            showSidebar={false}
            currentPage={10}
            onPageChange={onPageChange}
        >
            <Header title={"Employees Reports"} icon={BarChart3} />
        </BaseLayout>
    )
}

export default EmployeeReportsPage;