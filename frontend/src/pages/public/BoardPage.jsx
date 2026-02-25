import { useState, useEffect } from 'react';
import PublicLayout from '../../components/public/PublicLayout';
import { useLanguage } from '../../context/LanguageContext';
import api, { getImageUrl } from '../../utils/api';
import './AboutPage.css';

export default function BoardPage() {
  const { t } = useLanguage();
  const [boardMembers, setBoardMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    api.get('/board-members')
      .then(r => {
        const members = Array.isArray(r.data?.data) ? r.data.data : [];
        setBoardMembers(members);
      })
      .catch(err => {
        console.error('Failed to load board members:', err);
        setBoardMembers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Get members by section and sort
  const getMembersBySection = (sectionName) => {
    if (!Array.isArray(boardMembers)) return [];
    return boardMembers
      .filter(m => m && m.section === sectionName)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  };

  // Get featured member (sort_order = 1)
  const getFeatured = (sectionName) => {
    const members = getMembersBySection(sectionName);
    return members.find(m => m.sort_order === 1);
  };

  // Get grid members (sort_order > 1)
  const getGridMembers = (sectionName) => {
    const members = getMembersBySection(sectionName);
    return members.filter(m => m.sort_order > 1);
  };

  return (
    <PublicLayout>
      {/* ── BOARD OF DIRECTORS & MANAGEMENT ────────────────────────────── */}
      <section className="section ab-board-section">
        <div className="container">
          {loading ? (
            <div style={{textAlign: 'center', padding: '80px 20px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <p style={{color: '#666', fontSize: '14px'}}>Loading...</p>
            </div>
          ) : boardMembers && boardMembers.length > 0 ? (
            <>
              {getMembersBySection('board').length > 0 && (
                <>
                  <h2 className="section-title">{t('board_title') || 'Board of Directors'}</h2>
                  {getFeatured('board') && (
                    <div className="ab-board-featured">
                      <div className="ab-board-featured-card">
                        {getFeatured('board').image ? <img src={getImageUrl(getFeatured('board').image)} alt={getFeatured('board').name}/> : <div className="ab-board-featured-ph">👤</div>}
                        <h3>{getFeatured('board').name || 'N/A'}</h3>
                        <p>{getFeatured('board').position || ''}</p>
                      </div>
                    </div>
                  )}
                  {getGridMembers('board').length > 0 && (
                    <div className="ab-board-management-grid">
                      {getGridMembers('board').map(m => m ? (
                        <div key={m.id} className="ab-board-card">
                          {m.image ? <img src={getImageUrl(m.image)} alt={m.name}/> : <div className="ab-board-ph">👤</div>}
                          <h3>{m.name || 'N/A'}</h3>
                          <p>{m.position || ''}</p>
                        </div>
                      ) : null)}
                    </div>
                  )}
                </>
              )}

              {getMembersBySection('management').length > 0 && (
                <>
                  <h2 className="section-title" style={{marginTop: '60px'}}>{t('management_title') || 'Management Board'}</h2>
                  {getFeatured('management') && (
                    <div className="ab-board-featured">
                      <div className="ab-board-featured-card">
                        {getFeatured('management').image ? <img src={getImageUrl(getFeatured('management').image)} alt={getFeatured('management').name}/> : <div className="ab-board-featured-ph">👤</div>}
                        <h3>{getFeatured('management').name || 'N/A'}</h3>
                        <p>{getFeatured('management').position || ''}</p>
                      </div>
                    </div>
                  )}
                  {getGridMembers('management').length > 0 && (
                    <div className="ab-board-management-grid">
                      {getGridMembers('management').map(m => m ? (
                        <div key={m.id} className="ab-board-card">
                          {m.image ? <img src={getImageUrl(m.image)} alt={m.name}/> : <div className="ab-board-ph">👤</div>}
                          <h3>{m.name || 'N/A'}</h3>
                          <p>{m.position || ''}</p>
                        </div>
                      ) : null)}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div style={{textAlign: 'center', padding: '80px 20px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <h2 style={{color: '#666', marginBottom: '16px'}}>{t('board_title') || 'Board of Directors'}</h2>
              <p style={{color: '#999', fontSize: '14px'}}>No board members added yet</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
