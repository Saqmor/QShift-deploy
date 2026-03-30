import { Loader2, AlertTriangle, XCircle } from 'lucide-react';
import { AtmText } from '../AtmText';
import { Button } from '../AtmButton';

const VARIANT_CONFIG = {
    info: {
        bg: 'bg-blue-950/40',
        border: 'border-blue-600/50',
        icon: Loader2,
        iconClass: 'text-blue-400 animate-spin',
    },
    warning: {
        bg: 'bg-amber-950/40',
        border: 'border-amber-600/50',
        icon: AlertTriangle,
        iconClass: 'text-amber-400',
    },
    error: {
        bg: 'bg-red-950/40',
        border: 'border-red-600/50',
        icon: XCircle,
        iconClass: 'text-red-400',
    },
};

/**
 * MolStatusBanner
 *
 * Molécula genérica de banner de status.
 *
 * @param {'info'|'warning'|'error'} variant — define cores e ícone
 * @param {string} title
 * @param {string} description
 * @param {Array<{label: string, icon?: React.ComponentType, onClick: () => void, variant?: string}>} [actions]
 */
export function MolStatusBanner({ variant = 'info', title, description, actions }) {
    const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.info;
    const Icon = config.icon;

    const titleColorMap = { info: 'blue', warning: 'yellow', error: 'red' };
    const titleColor = titleColorMap[variant] || 'white';

    const btnVariantMap = { primary: 'danger', secondary: 'secondary' };

    return (
        <div
            className={`
                flex items-start gap-3 rounded-lg px-4 py-3 mb-4
                border transition-all duration-300
                ${config.bg} ${config.border}
            `}
        >
            <div className="mt-0.5 shrink-0">
                <Icon className={`w-5 h-5 ${config.iconClass}`} />
            </div>

            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <AtmText as="span" size="sm" weight="semibold" color={titleColor}>
                    {title}
                </AtmText>
                <AtmText as="span" size="xs" color="muted">
                    {description}
                </AtmText>

                {actions && actions.length > 0 && (
                    <div className="flex gap-2 mt-2">
                        {actions.map((action, idx) => {
                            const ActionIcon = action.icon;
                            const btnVariant = btnVariantMap[action.variant] ?? 'danger';
                            return (
                                <Button
                                    key={idx}
                                    size="sm"
                                    variant={btnVariant}
                                    onClick={action.onClick}
                                >
                                    {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
                                    {action.label}
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
