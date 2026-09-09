import styles from './FaqItem.module.css';

function FaqItem({ item, onSelectFaq }) {
  const { id, question, answer, category, isHot } = item;

  return (
    <div className={styles.faqCard}>
      <div className={styles.cardHeader}>
        <span className={styles.categoryBadge}>{category}</span>
        {isHot && <span className={styles.hotBadge}>🔥 Hot</span>}
      </div>

      <h3 className={styles.question}>{question}</h3>
      <p className={styles.answer}>{answer}</p>

      <button
        type="button"
        className={styles.detailBtn}
        onClick={() => onSelectFaq(id)}
      >
        Xem chi tiết
      </button>
    </div>
  );
}

export default FaqItem;