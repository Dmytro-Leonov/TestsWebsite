import { Modal, Button } from "flowbite-react";

const ConfirmationModal = ({ prompt, confirmText, rejectText, onClick, showModal, setShowModal }) => {
  return (
    <Modal
      show={showModal}
      size="md"
      popup={true}
      dismissible={false}
      onClose={() => setShowModal(false)}
    >
      <Modal.Header />
      <Modal.Body className="flex flex-col gap-2">
        <h1 className="text-2xl">{prompt}</h1>
        <div className="flex flex-row-reverse gap-2">
          <Button color="blue" size="sm" onClick={() => setShowModal(false)}>
            {rejectText}
          </Button>
          <Button color="red" size="sm" onClick={() => onClick(true)}>
            {confirmText}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationModal;
