import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, LayoutGrid } from 'lucide-react';
import { useJobs } from '../hooks/useJobs';
import { STATUSES, STATUS_CFG } from '../lib/constants';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import JobDetailsModal from '../components/JobDetailsModal';
import ConfirmModal from '../components/ConfirmModal';
import FilterBar from '../components/FilterBar';
import { ColumnSkeleton } from '../components/Skeleton';

export default function BoardPage() {
  const [filters, setFilters]           = useState({});
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingJob, setEditingJob]     = useState(null);
  const [defaultStatus, setDefault]     = useState('Wishlist');

  // Details modal state
  const [detailsJob, setDetailsJob]     = useState(null);

  // Confirm-delete state
  const [confirmJob, setConfirmJob]     = useState(null);

  const { jobs, loading, addJob, editJob, removeJob, moveJob } = useJobs(filters);

  const onDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    await moveJob(draggableId, destination.droppableId);
  };

  const openAdd  = (status = 'Wishlist') => { setEditingJob(null); setDefault(status); setModalOpen(true); };
  const openEdit = (job) => { setEditingJob(job); setDetailsJob(null); setModalOpen(true); };

  const handleSave = async (data) => {
    if (editingJob) await editJob(editingJob._id, data);
    else            await addJob(data);
    setModalOpen(false);
  };

  // Open the read-only details view
  const openDetails = (job) => { setDetailsJob(job); };

  // Request deletion — show confirm modal
  const requestDelete = (job) => { setConfirmJob(job); setDetailsJob(null); };

  // Confirmed delete
  const handleConfirmDelete = async () => {
    if (confirmJob) await removeJob(confirmJob._id);
    setConfirmJob(null);
  };

  const colJobs = (s) => jobs.filter((j) => j.status === s);
  const total   = jobs.length;

  return (
    <>
      {/* ─── Toolbar ─── */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--c-border)', background: 'var(--c-surface)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--c-txt-2)' }}>
          <LayoutGrid size={14} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-txt)' }}>Board</span>
          {!loading && (
            <span style={{ fontSize: 11, color: 'var(--c-txt-3)', marginLeft: 2 }}>
              {total} job{total !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div style={{ width: '1px', height: 16, background: 'var(--c-border)' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <FilterBar onChange={setFilters} />
        </div>
        <button onClick={() => openAdd()} className="sg-btn-primary" style={{ flexShrink: 0 }}>
          <Plus size={13} /> Add job
        </button>
      </div>

      {/* ─── Kanban ─── */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: 10,
            padding: '16px 16px 0',
            height: 'calc(100vh - 104px)',
            alignItems: 'stretch',
            boxSizing: 'border-box',
          }}
        >
          {STATUSES.map((status) => {
            const cfg  = STATUS_CFG[status];
            const col  = colJobs(status);
            return (
              <div
                key={status}
                style={{
                  flexShrink: 0,
                  width: 'calc((100vw - 80px) / 5)',
                  minWidth: 210,
                  maxWidth: 320,
                  /* Column visual container */
                  background: 'var(--c-surface-raised, var(--c-surface))',
                  border: '1px solid var(--c-border)',
                  borderRadius: 10,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                }}
              >
                {/* Column header (sticky inside the column) */}
                <div style={{
                  position: 'sticky', top: 0, zIndex: 10,
                  background: 'var(--c-surface)',
                  borderRadius: '10px 10px 0 0',
                  padding: '10px 12px 0',
                  borderBottom: `1.5px solid ${cfg.dot}30`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-txt)', letterSpacing: '-0.01em' }}>
                        {status}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 99, background: cfg.bg, color: cfg.dot }}>
                        {col.length}
                      </span>
                    </div>
                    <button
                      onClick={() => openAdd(status)}
                      title={`Add to ${status}`}
                      style={{ padding: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-txt-3)', display: 'flex', borderRadius: 4 }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--c-txt)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--c-txt-3)'}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Cards droppable area */}
                <Droppable droppableId={status}>
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.droppableProps}
                      style={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        minHeight: 80,
                        transition: 'background 0.15s, padding 0.15s',
                        borderRadius: '0 0 10px 10px',
                        padding: snap.isDraggingOver ? '8px 8px 12px' : '6px 8px 12px',
                        background: snap.isDraggingOver ? cfg.bg : 'transparent',
                        display: 'flex', flexDirection: 'column', gap: 6,
                      }}
                    >
                      {loading
                        ? <ColumnSkeleton />
                        : col.map((job, idx) => (
                          <Draggable key={job._id} draggableId={job._id} index={idx}>
                            {(p, s) => (
                              <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}>
                                <JobCard
                                  job={job}
                                  isDragging={s.isDragging}
                                  onEdit={() => openEdit(job)}
                                  onDelete={() => requestDelete(job)}
                                  onViewDetails={() => openDetails(job)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      }

                      {!loading && col.length === 0 && !snap.isDraggingOver && (
                        <EmptyCol status={status} onAdd={() => openAdd(status)} />
                      )}

                      {prov.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* ─── Job Details Modal ─── */}
      {detailsJob && (
        <JobDetailsModal
          job={detailsJob}
          onClose={() => setDetailsJob(null)}
          onEdit={() => openEdit(detailsJob)}
          onDelete={() => requestDelete(detailsJob)}
        />
      )}

      {/* ─── Edit/Add Form Modal ─── */}
      {modalOpen && (
        <JobModal job={editingJob} defaultStatus={defaultStatus} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}

      {/* ─── Delete Confirm Modal ─── */}
      {confirmJob && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirmJob.company} — ${confirmJob.role}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmJob(null)}
        />
      )}
    </>
  );
}

function EmptyCol({ status, onAdd }) {
  return (
    <div style={{ padding: '28px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <p style={{ fontSize: 11, color: 'var(--c-txt-3)' }}>No {status.toLowerCase()} jobs</p>
      <button onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--c-txt-2)', background: 'none', border: 'none', cursor: 'pointer' }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--c-txt)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--c-txt-2)'}
      >
        <Plus size={11} /> Add one
      </button>
    </div>
  );
}
