import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface ModalProps {
  loading: boolean;
  error: string | null;
}

const Modal: React.FC<ModalProps> = ({ loading, error }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(loading || !!error);
  const refLoading = useRef<HTMLDivElement | null>(null);
  const refError = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (refLoading?.current) {
      refLoading.current?.querySelector(`button`)?.remove();
    }
    if (refError?.current) {
      refError.current?.querySelector(`button`)?.remove();
    }
  }, []);

  // Automatically update modalOpen state based on props
  useEffect(() => {
    setModalOpen(loading || !!error);
  }, [loading, error]);

  return (
    <>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {loading && (
          <DialogContent ref={refLoading}>
            <DialogHeader>
              <DialogTitle>Getting current location...</DialogTitle>
              <DialogDescription>
                <div className="flex items-center justify-center">
                  <div className="m-10 h-12 w-12 animate-bounce rounded-full text-yellow-500 dark:text-yellow-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                      >
                        <path strokeWidth="3" d="M12 11h.01v.01H12z" />
                        <path
                          strokeWidth="2"
                          d="m12 22l5.5-5.5a7.778 7.778 0 1 0-11 0z"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
        {error && (
          <DialogContent ref={refError}>
            <DialogHeader>
              <DialogTitle>Error getting location</DialogTitle>
              <DialogDescription>
                <div>
                  <p className="text-red-500">Error: {error}</p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default Modal;
