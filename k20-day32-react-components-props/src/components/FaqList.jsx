import FaqItem from './FaqItem';
import styles from './FaqList.module.css';

function FaqList({ faqs, onSelectFaq }) {
  return (
    <div className={styles.faqContainer}>
      {/* Kiểm tra length > 0 để tránh render số 0 ra màn hình */}
      {faqs.length > 0 ? (
        faqs.map((faq) => (
          <FaqItem key={faq.id} item={faq} onSelectFaq={onSelectFaq} />
        ))
      ) : (
        <div className={styles.emptyState}>Không có câu hỏi FAQ nào.</div>
      )}
    </div>
  );
}

export default FaqList;