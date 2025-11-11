import { use, useState } from 'react';
import {DataBaseUser} from '../MockData.js';
import BaseLayout from '../layouts/BaseLayout.jsx';

function RegisterPage({onPageChange}) {

    const [email, setEmail] = useState(null);
    const [confEmail, setConfEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const handleRegister = () => {

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">

        </div>
    );
}