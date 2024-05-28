import {
  Icon,
  IconButton,
  IconButtonProps,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react";

import React from "react";

import CheckIcon from "@/public/assets/generals/check.svg";
import CopyIcon from "@/public/assets/generals/copy.svg";
interface CopyClipBoardProps extends IconButtonProps {
  context: string;
}
const CopyClipBoard = ({ context, w, h, ...rest }: CopyClipBoardProps) => {
  const { onCopy, hasCopied } = useClipboard(context);

  return (
    <Tooltip label={hasCopied ? "COPIED" : "COPY"} placement="right">
      <IconButton
        variant="unstyled"
        minWidth="unset"
        height="auto"
        color="white"
        cursor="pointer"
        onClick={(e) => {
          e.preventDefault();
          onCopy();
        }}
        icon={
          <Icon
            w={w || 6}
            h={h || 6}
            as={hasCopied ? CheckIcon : CopyIcon}
            verticalAlign="middle"
          />
        }
        {...rest}
      />
    </Tooltip>
  );
};

export default CopyClipBoard;
