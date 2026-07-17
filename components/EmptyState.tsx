export default function EmptyState() {
  return (
    <section
      aria-labelledby="empty-registrations-title"
      className="rounded-2xl border border-dashed border-dark/15 bg-white px-6 py-14 text-center shadow-sm"
    >
      <h2
        id="empty-registrations-title"
        className="text-lg font-semibold text-secondary"
      >
        No registrations to review
      </h2>
    </section>
  );
}
