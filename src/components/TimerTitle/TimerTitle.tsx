import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { FiEdit } from "react-icons/fi";
import socket from "../Socket/socket";
import { StyledWorkBreakBanner } from "../Room/Room.styled";
import {
	StyledEye,
	TitleEditButtonPosition,
	TitleEditEmojiSize,
} from "./TimerTitle.styled";
import ModalComponent from "../Modal/Modal";
import TitleModal from "../Modal/TitleModal";

interface TimerTitleProps {
	isLoaded: boolean;
	workGrey: string;
	isBreak: boolean;
	isPublicRoom: boolean;
}

const TimerTitle = (props: TimerTitleProps): JSX.Element => {
	const { isLoaded, workGrey, isBreak, isPublicRoom } = props;
	const [timerTitle, setTimerTitle] = useState<string>("");
	const [isTitleModalOpen, setIsTitleModalOpen] = useState<boolean>(false);

	useEffect(() => {
		socket.on("updatedTitle", ({ title }) => {
			setTimerTitle(title);
		});

		return () => {
			socket.off("updatedTitle");
		};
	}, []);

	return (
		<>
			<TitleEditButtonPosition>
				<StyledWorkBreakBanner color={workGrey} isLoaded={isLoaded}>
					{isPublicRoom && (
						<StyledEye
							data-tooltip-id="my-tooltip"
							data-tooltip-content="Room is Public"
							data-tooltip-place="top"
							onClick={(): void => {
								// react ga
								ReactGA.event({
									category: "Timer",
									action: "Click Public Eye",
									label: "",
								});
							}}
						/>
					)}

					{timerTitle ||
						(isBreak
							? "Time to take a break!"
							: "Let's get some work done!")}
				</StyledWorkBreakBanner>
				<TitleEditEmojiSize color={workGrey} isLoaded={isLoaded}>
					<FiEdit
						onClick={(): void => {
							setIsTitleModalOpen(true);

							// react ga
							ReactGA.event({
								category: "Timer",
								action: "Edit Title",
								label: "Edit Title",
							});
						}}
					/>
				</TitleEditEmojiSize>
			</TitleEditButtonPosition>
			<ModalComponent
				isModalOpen={isTitleModalOpen}
				setIsModalOpen={setIsTitleModalOpen}
			>
				<TitleModal
					isTitleModalOpen={isTitleModalOpen}
					setIsTitleModalOpen={setIsTitleModalOpen}
					isBreak={isBreak}
				/>
			</ModalComponent>
		</>
	);
};

export default TimerTitle;
