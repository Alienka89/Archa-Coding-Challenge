import { Button, Modal, LoadingSkeleton, LoadingSpinner } from '@/components/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense, useCallback, useState } from 'react';

const CategoryList = lazy(() =>
  import('@/components/features/CategoryList').then((m) => ({ default: m.CategoryList }))
);
const CreateCategoryForm = lazy(() =>
  import('@/components/features/CreateCategoryForm').then((m) => ({
    default: m.CreateCategoryForm,
  }))
);
const ExpenseCodeList = lazy(() =>
  import('@/components/features/ExpenseCodeList').then((m) => ({
    default: m.ExpenseCodeList,
  }))
);
const CreateCodeForm = lazy(() =>
  import('@/components/features/CreateCodeForm').then((m) => ({
    default: m.CreateCodeForm,
  }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const AppContent = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingCode, setIsCreatingCode] = useState(false);

  const isAddCodeDisabled = selectedCategoryId === null;

  const handleOpenCategoryModal = useCallback(() => setIsCreatingCategory(true), []);
  const handleCloseCategoryModal = useCallback(() => setIsCreatingCategory(false), []);
  const handleOpenCodeModal = useCallback(() => setIsCreatingCode(true), []);
  const handleCloseCodeModal = useCallback(() => setIsCreatingCode(false), []);

  return (
    <div className="min-h-screen bg-dark-bg">
      <header className="bg-dark-surface border-b border-dark-border sticky top-0 z-10 backdrop-blur-sm bg-dark-surface/80">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold text-white">Expense Categories & Codes</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Categories</h2>
              <Button variant="primary" size="sm" onClick={handleOpenCategoryModal}>
                + Add Category
              </Button>
            </div>

            <Suspense fallback={<LoadingSkeleton count={3} height="h-[74px]" />}>
              <CategoryList
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={setSelectedCategoryId}
              />
            </Suspense>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Expense Codes</h2>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenCodeModal}
                disabled={isAddCodeDisabled}
              >
                + Add Code
              </Button>
            </div>

            <Suspense fallback={<LoadingSkeleton count={3} />}>
              <ExpenseCodeList categoryId={selectedCategoryId} />
            </Suspense>
          </section>
        </div>
      </main>

      <Modal
        isOpen={isCreatingCategory}
        onClose={handleCloseCategoryModal}
        title="Create New Category"
      >
        <Suspense fallback={<LoadingSpinner className="h-32" />}>
          <CreateCategoryForm
            onSuccess={handleCloseCategoryModal}
            onCancel={handleCloseCategoryModal}
          />
        </Suspense>
      </Modal>

      <Modal
        isOpen={isCreatingCode}
        onClose={handleCloseCodeModal}
        title="Create New Code"
      >
        {selectedCategoryId && (
          <Suspense fallback={<LoadingSpinner className="h-32" />}>
            <CreateCodeForm
              categoryId={selectedCategoryId}
              onSuccess={handleCloseCodeModal}
              onCancel={handleCloseCodeModal}
            />
          </Suspense>
        )}
      </Modal>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
