export default function StatusBadge({ status }) {
  const styles = {
    present: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    absent: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    uncertain: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };
  
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg ${styles[status] || styles.uncertain}`}>
      {status}
    </span>
  );
}
