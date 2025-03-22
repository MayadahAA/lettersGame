'use client';

import React, { useState, useCallback, Fragment } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "./_components/ui/Button";
import { FaPlus, FaUserPlus, FaEye } from "react-icons/fa";

const CreateRoomButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => (
  <Button variant="primary" onClick={onClick} disabled={disabled}>
    <FaPlus className="h-5 w-5 ml-2" />
    {disabled ? "جاري إنشاء الغرفة..." : "إنشاء غرفة"}
  </Button>
);

const JoinGameButton = React.memo(
  ({ openModal }: { openModal: () => void }) => (
    <Button variant="primary" className="bg-yellow-500" onClick={openModal}>
      <FaUserPlus className="h-5 w-5 ml-2" />
      الانضمام للعبة
    </Button>
  )
);
JoinGameButton.displayName = 'JoinGameButton';

const SpectateButton = React.memo(
  ({ onClick }: { onClick: () => void }) => (
    <Button variant="primary" className="bg-gray-500" onClick={onClick}>
      <FaEye className="h-5 w-5 ml-2" />
      الجمهور
    </Button>
  )
);
SpectateButton.displayName = 'SpectateButton';

export default function Home() {
  const [roomCode, setRoomCode] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerTeam, setPlayerTeam] = useState<"red" | "green">("red");
  const router = useRouter();
  // تم حذف حالة التحميل لأنها لم تُستخدم
  const handleCreateRoom = useCallback(async () => {
    const userId = "guest_" + Math.random().toString(36).substr(2, 9);
    setIsCreatingRoom(true);
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      console.log("Room created with ID:", data.roomId);
      router.push(`/game/${data.roomId}/host`);
    } catch (err) {
      toast.error(
        "حدث خطأ أثناء إنشاء الغرفة: " +
          (err instanceof Error ? err.message : "غير معروف")
      );
      console.error("Error creating room:", err);
    } finally {
      setIsCreatingRoom(false);
    }
  }, [router]);

  const handleJoinRoom = async () => {
    if ( !playerName || !playerTeam) {
      toast.error("يرجى إدخال اسم اللاعب والفريق.");
      return;
    }
    try {
      // Generate a random player ID
      const playerId = "player_" + Math.random().toString(36).substr(2, 9);
      
      const response = await fetch(`/api/rooms/${roomCode}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: playerId,  // Add this line
          name: playerName, 
          team: playerTeam 
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      router.push(`/game/${roomCode}/players/${playerTeam}/${playerId}`);
    } catch (err) {
      toast.error(
        "حدث خطأ أثناء الانضمام للغرفة: " +
          (err instanceof Error ? err.message : "غير معروف")
      );
      console.error("Error joining room:", err);
    }
  };

  const handleSpectate = () => {
    router.push("/spectate");
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const handleJoinRoomAndCloseModal = () => {
    handleJoinRoom();
    closeModal();
  };

  return (
    <main className="min-h-screen rtl-dir gradient-bg flex flex-col items-center justify-between py-8 px-4">
      <div className="bg-white rounded-container w-full p-8 md:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
          اختر طريقة اللعب
        </h2>
        <div className="mb-8 flex gap-4">
          <CreateRoomButton
            onClick={handleCreateRoom}
            disabled={isCreatingRoom}
          />
          <JoinGameButton openModal={openModal} />
          <SpectateButton onClick={handleSpectate} />
        </div>
      </div>

      <Transition appear show={modalIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    الانضمام إلى الغرفة
                  </Dialog.Title>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="أدخل الرمز هنا"
                      className="room-code-input flex-1 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="اسم اللاعب"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="room-code-input flex-1 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mt-2">
                    <select
                      value={playerTeam}
                      onChange={(e) =>
                        setPlayerTeam(e.target.value as "red" | "green")
                      }
                      className="room-code-input flex-1 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="red">فريق أحمر</option>
                      <option value="green">فريق أخضر</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={handleJoinRoomAndCloseModal}
                      disabled={
                         !playerName || !playerTeam
                      }
                    >
                      انضمام
                    </Button>
                    <Button onClick={closeModal}>إلغاء</Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  );
}