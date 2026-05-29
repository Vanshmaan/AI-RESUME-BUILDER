export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center glass-card border-dashed">
    {Icon && (
      <div className="flex items-center justify-center mb-4 rounded-2xl size-14 bg-brand-50 dark:bg-brand-500/10 text-brand-600">
        <Icon className="size-7" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
