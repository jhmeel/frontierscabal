
export const SuccessIcon = ( props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const InfoIcon = ({ fill = "currentColor", size = 24 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill={fill}
      height={size}
      width={size}
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const ErrorIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...props}>
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const IconGoogle = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="https://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="L5wZDc"
    >
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
        {...props}
      ></path>
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      ></path>
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      ></path>
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      ></path>
      <path fill="none" d="M2 2h44v44H2z"></path>
    </svg>
  );
};

export const IconEyeSlashFill = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 01-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 002.79-.588zM5.21 3.088A7.028 7.028 0 018 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 00-4.474-4.474L5.21 3.089z" />
      <path d="M5.525 7.646a2.5 2.5 0 002.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 012.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.708z" />
    </svg>
  );
};

export const IconEyeFill = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M396 512a112 112 0 10224 0 112 112 0 10-224 0zm546.2-25.8C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM508 688c-97.2 0-176-78.8-176-176s78.8-176 176-176 176 78.8 176 176-78.8 176-176 176z" />
    </svg>
  );
};

export const IconBxSearchAlt = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M10 18a7.952 7.952 0 004.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0018 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />
      <path d="M11.412 8.586c.379.38.588.882.588 1.414h2a3.977 3.977 0 00-1.174-2.828c-1.514-1.512-4.139-1.512-5.652 0l1.412 1.416c.76-.758 2.07-.756 2.826-.002z" />
    </svg>
  );
};

export const IconSetting = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M256 176a80 80 0 1080 80 80.24 80.24 0 00-80-80zm172.72 80a165.53 165.53 0 01-1.64 22.34l48.69 38.12a11.59 11.59 0 012.63 14.78l-46.06 79.52a11.64 11.64 0 01-14.14 4.93l-57.25-23a176.56 176.56 0 01-38.82 22.67l-8.56 60.78a11.93 11.93 0 01-11.51 9.86h-92.12a12 12 0 01-11.51-9.53l-8.56-60.78A169.3 169.3 0 01151.05 393L93.8 416a11.64 11.64 0 01-14.14-4.92L33.6 331.57a11.59 11.59 0 012.63-14.78l48.69-38.12A174.58 174.58 0 0183.28 256a165.53 165.53 0 011.64-22.34l-48.69-38.12a11.59 11.59 0 01-2.63-14.78l46.06-79.52a11.64 11.64 0 0114.14-4.93l57.25 23a176.56 176.56 0 0138.82-22.67l8.56-60.78A11.93 11.93 0 01209.94 26h92.12a12 12 0 0111.51 9.53l8.56 60.78A169.3 169.3 0 01361 119l57.2-23a11.64 11.64 0 0114.14 4.92l46.06 79.52a11.59 11.59 0 01-2.63 14.78l-48.69 38.12a174.58 174.58 0 011.64 22.66z" />
    </svg>
  );
};

export const MailIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M20 8l-8 5-8-5V6l8 5 8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
    </svg>
  );
};

export const PasswordIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      height="18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeWidth="1.5"
        stroke="#141B34"
        d="M18 11.0041C17.4166 9.91704 16.273 9.15775 14.9519 9.0993C13.477 9.03404 11.9788 9 10.329 9C8.67911 9 7.18091 9.03404 5.70604 9.0993C3.95328 9.17685 2.51295 10.4881 2.27882 12.1618C2.12602 13.2541 2 14.3734 2 15.5134C2 16.6534 2.12602 17.7727 2.27882 18.865C2.51295 20.5387 3.95328 21.8499 5.70604 21.9275C6.42013 21.9591 7.26041 21.9834 8 22"
      ></path>
      <path
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="1.5"
        stroke="#141B34"
        d="M6 9V6.5C6 4.01472 8.01472 2 10.5 2C12.9853 2 15 4.01472 15 6.5V9"
      ></path>
      <path
        fill="#141B34"
        d="M21.2046 15.1045L20.6242 15.6956V15.6956L21.2046 15.1045ZM21.4196 16.4767C21.7461 16.7972 22.2706 16.7924 22.5911 16.466C22.9116 16.1395 22.9068 15.615 22.5804 15.2945L21.4196 16.4767ZM18.0228 15.1045L17.4424 14.5134V14.5134L18.0228 15.1045ZM18.2379 18.0387C18.5643 18.3593 19.0888 18.3545 19.4094 18.028C19.7299 17.7016 19.7251 17.1771 19.3987 16.8565L18.2379 18.0387ZM14.2603 20.7619C13.7039 21.3082 12.7957 21.3082 12.2394 20.7619L11.0786 21.9441C12.2794 23.1232 14.2202 23.1232 15.4211 21.9441L14.2603 20.7619ZM12.2394 20.7619C11.6914 20.2239 11.6914 19.358 12.2394 18.82L11.0786 17.6378C9.86927 18.8252 9.86927 20.7567 11.0786 21.9441L12.2394 20.7619ZM12.2394 18.82C12.7957 18.2737 13.7039 18.2737 14.2603 18.82L15.4211 17.6378C14.2202 16.4587 12.2794 16.4587 11.0786 17.6378L12.2394 18.82ZM14.2603 18.82C14.8082 19.358 14.8082 20.2239 14.2603 20.7619L15.4211 21.9441C16.6304 20.7567 16.6304 18.8252 15.4211 17.6378L14.2603 18.82ZM20.6242 15.6956L21.4196 16.4767L22.5804 15.2945L21.785 14.5134L20.6242 15.6956ZM15.4211 18.82L17.8078 16.4767L16.647 15.2944L14.2603 17.6377L15.4211 18.82ZM17.8078 16.4767L18.6032 15.6956L17.4424 14.5134L16.647 15.2945L17.8078 16.4767ZM16.647 16.4767L18.2379 18.0387L19.3987 16.8565L17.8078 15.2945L16.647 16.4767ZM21.785 14.5134C21.4266 14.1616 21.0998 13.8383 20.7993 13.6131C20.4791 13.3732 20.096 13.1716 19.6137 13.1716V14.8284C19.6145 14.8284 19.619 14.8273 19.6395 14.8357C19.6663 14.8466 19.7183 14.8735 19.806 14.9391C19.9969 15.0822 20.2326 15.3112 20.6242 15.6956L21.785 14.5134ZM18.6032 15.6956C18.9948 15.3112 19.2305 15.0822 19.4215 14.9391C19.5091 14.8735 19.5611 14.8466 19.5879 14.8357C19.6084 14.8273 19.6129 14.8284 19.6137 14.8284V13.1716C19.1314 13.1716 18.7483 13.3732 18.4281 13.6131C18.1276 13.8383 17.8008 14.1616 17.4424 14.5134L18.6032 15.6956Z"
      ></path>
    </svg>
  );
};

export const IconUserSettingsLine = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 14v2a6 6 0 00-6 6H4a8 8 0 018-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm2.595 7.812a3.51 3.51 0 010-1.623l-.992-.573 1-1.732.992.573A3.496 3.496 0 0117 14.645V13.5h2v1.145c.532.158 1.012.44 1.405.812l.992-.573 1 1.732-.992.573a3.51 3.51 0 010 1.622l.992.573-1 1.732-.992-.573a3.496 3.496 0 01-1.405.812V22.5h-2v-1.145a3.496 3.496 0 01-1.405-.812l-.992.573-1-1.732.992-.572zM18 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  );
};

export const IconNotifications = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M440.08 341.31c-1.66-2-3.29-4-4.89-5.93-22-26.61-35.31-42.67-35.31-118 0-39-9.33-71-27.72-95-13.56-17.73-31.89-31.18-56.05-41.12a3 3 0 01-.82-.67C306.6 51.49 282.82 32 256 32s-50.59 19.49-59.28 48.56a3.13 3.13 0 01-.81.65c-56.38 23.21-83.78 67.74-83.78 136.14 0 75.36-13.29 91.42-35.31 118-1.6 1.93-3.23 3.89-4.89 5.93a35.16 35.16 0 00-4.65 37.62c6.17 13 19.32 21.07 34.33 21.07H410.5c14.94 0 28-8.06 34.19-21a35.17 35.17 0 00-4.61-37.66zM256 480a80.06 80.06 0 0070.44-42.13 4 4 0 00-3.54-5.87H189.12a4 4 0 00-3.55 5.87A80.06 80.06 0 00256 480z" />
    </svg>
  );
};
export const IconWhatsapp = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
    </svg>
  );
};

export const IconNotificationsOff = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M448 464a15.92 15.92 0 01-11.31-4.69l-384-384a16 16 0 0122.62-22.62l384 384A16 16 0 01448 464zM440.08 341.31c-1.66-2-3.29-4-4.89-5.93-22-26.61-35.31-42.67-35.31-118 0-39-9.33-71-27.72-95-13.56-17.73-31.89-31.18-56.05-41.12a3 3 0 01-.82-.67C306.6 51.49 282.82 32 256 32s-50.59 19.49-59.28 48.56a3.13 3.13 0 01-.81.65 157.88 157.88 0 00-21.88 11 8 8 0 00-1.49 12.49l261.78 261.74a8 8 0 0013.6-6.63 35.39 35.39 0 00-7.84-18.5zM112.14 217.35c0 75.36-13.29 91.42-35.31 118-1.6 1.93-3.23 3.89-4.89 5.93a35.16 35.16 0 00-4.65 37.62c6.17 13 19.32 21.07 34.33 21.07H312.8a8 8 0 005.66-13.66l-192-192a8 8 0 00-13.62 5q-.7 8.69-.7 18.04zM256 480a80.06 80.06 0 0070.44-42.13 4 4 0 00-3.54-5.87H189.12a4 4 0 00-3.55 5.87A80.06 80.06 0 00256 480z" />
    </svg>
  );
};

export const IconArrowsHamburger1 = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M0 21h6M16 21h48M0 33h6M16 33h48M0 45h6M16 45h48"
      />
    </svg>
  );
};

export const IconHamburgerMenu = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M16 18v2H5v-2h11zm5-7v2H3v-2h18zm-2-7v2H8V4h11z" />
    </svg>
  );
};

export const IconArrowRight = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z"
      />
    </svg>
  );
};

export const IconArrowLeftfunction = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M15 8a.5.5 0 00-.5-.5H2.707l3.147-3.146a.5.5 0 10-.708-.708l-4 4a.5.5 0 000 .708l4 4a.5.5 0 00.708-.708L2.707 8.5H14.5A.5.5 0 0015 8z"
      />
    </svg>
  );
};

export const IconBookmark = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M2 2a2 2 0 012-2h8a2 2 0 012 2v13.5a.5.5 0 01-.777.416L8 13.101l-5.223 2.815A.5.5 0 012 15.5V2zm2-1a1 1 0 00-1 1v12.566l4.723-2.482a.5.5 0 01.554 0L13 14.566V2a1 1 0 00-1-1H4z" />
    </svg>
  );
};

export const IconBxsBookmark = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M19 10.132v-6c0-1.103-.897-2-2-2H7c-1.103 0-2 .897-2 2V22l7-4.666L19 22V10.132z" />
    </svg>
  );
};

export const IconBxsBookmarks = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M400 0H176a64.11 64.11 0 00-62 48h228a74 74 0 0174 74v304.89l22 17.6a16 16 0 0019.34.5 16.41 16.41 0 006.66-13.42V64a64 64 0 00-64-64z" />
      <path d="M320 80H112a64 64 0 00-64 64v351.62A16.36 16.36 0 0054.6 509a16 16 0 0019.71-.71L216 388.92l141.69 119.32a16 16 0 0019.6.79 16.4 16.4 0 006.71-13.44V144a64 64 0 00-64-64z" />
    </svg>
  );
};

export const IconBxsBookmarkAlt = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M18.5 2h-12C4.57 2 3 3.57 3 5.5V22l7-3.5 7 3.5v-9h5V5.5C22 3.57 20.43 2 18.5 2zm1.5 9h-3V5.5c0-.827.673-1.5 1.5-1.5s1.5.673 1.5 1.5V11z" />
    </svg>
  );
};

export const IconClockRotateLeft = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24h110.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24v104c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z" />
    </svg>
  );
};

export const IconClock = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M232 120c0-13.3 10.7-24 24-24s24 10.7 24 24v123.2l85.3 56.8c11 7.4 14 22.3 5.8 33.3-6.5 11-21.4 14-32.4 5.8l-96-64c-6.7-3.6-10.7-11.1-10.7-20V120zM256 0c141.4 0 256 114.6 256 256S397.4 512 256 512 0 397.4 0 256 114.6 0 256 0zM48 256c0 114.9 93.1 208 208 208s208-93.1 208-208S370.9 48 256 48 48 141.1 48 256z" />
    </svg>
  );
};

export const IconContentCopy = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M19 21H8V7h11m0-2H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2m-3-4H4a2 2 0 00-2 2v14h2V3h12V1z" />
    </svg>
  );
};

export const IconDeleteForeverOutline = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M14.12 10.47L12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12-1.41-1.41M15.5 4l-1-1h-5l-1 1H5v2h14V4h-3.5M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12M8 9h8v10H8V9z" />
    </svg>
  );
};

export const IconRemoveFill = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M6.535 3H21a1 1 0 011 1v16a1 1 0 01-1 1H6.535a1 1 0 01-.832-.445l-5.333-8a1 1 0 010-1.11l5.333-8A1 1 0 016.535 3zM13 10.586l-2.828-2.829-1.415 1.415L11.586 12l-2.829 2.828 1.415 1.415L13 13.414l2.828 2.829 1.415-1.415L14.414 12l2.829-2.828-1.415-1.415L13 10.586z" />
    </svg>
  );
};

export const IconUserDeleteOutline = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      baseProfile="tiny"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M21 14h-6a1 1 0 110-2h6a1 1 0 110 2zM9 6c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3m0-2C6.236 4 4 6.238 4 9s2.236 5 5 5 5-2.238 5-5-2.236-5-5-5zm0 13c2.021 0 3.301.771 3.783 1.445C12.1 18.705 10.814 19 9 19c-1.984 0-3.206-.305-3.818-.542C5.641 17.743 6.959 17 9 17m0-2c-3.75 0-6 2-6 4 0 1 2.25 2 6 2 3.518 0 6-1 6-2 0-2-2.354-4-6-4z" />
    </svg>
  );
};

export const IconHouse = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 576 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40h-16c-1.1 0-2.2 0-3.3-.1-1.4.1-2.8.1-4.2.1H392c-22.1 0-40-17.9-40-40v-88c0-17.7-14.3-32-32-32h-64c-17.7 0-32 14.3-32 32v88c0 22.1-17.9 40-40 40h-55.9c-1.5 0-3-.1-4.5-.2-1.2.1-2.4.2-3.6.2h-16c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9.1-2.8v-69.6H32c-18 0-32-14-32-32.1 0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7l255.4 224.5c8 7 12 15 11 24z" />
    </svg>
  );
};

export const IconProfile = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM380 696c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm0-144c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm0-144c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40zm304 272c0 4.4-3.6 8-8 8H492c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h184c4.4 0 8 3.6 8 8v48zm0-144c0 4.4-3.6 8-8 8H492c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h184c4.4 0 8 3.6 8 8v48zm0-144c0 4.4-3.6 8-8 8H492c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h184c4.4 0 8 3.6 8 8v48z" />
    </svg>
  );
};

export const IconProfile1 = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16 9a4 4 0 11-8 0 4 4 0 018 0zm-2 0a2 2 0 11-4 0 2 2 0 014 0z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12c0 2.09.713 4.014 1.908 5.542A8.986 8.986 0 0112.065 14a8.984 8.984 0 017.092 3.458A9 9 0 103 12zm9 9a8.963 8.963 0 01-5.672-2.012A6.992 6.992 0 0112.065 16a6.991 6.991 0 015.689 2.92A8.964 8.964 0 0112 21z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const Icon010Blog = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 448 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M446.6 222.7c-1.8-8-6.8-15.4-12.5-18.5-1.8-1-13-2.2-25-2.7-20.1-.9-22.3-1.3-28.7-5-10.1-5.9-12.8-12.3-12.9-29.5-.1-33-13.8-63.7-40.9-91.3-19.3-19.7-40.9-33-65.5-40.5-5.9-1.8-19.1-2.4-63.3-2.9-69.4-.8-84.8.6-108.4 10C45.9 59.5 14.7 96.1 3.3 142.9 1.2 151.7.7 165.8.2 246.8c-.6 101.5.1 116.4 6.4 136.5 15.6 49.6 59.9 86.3 104.4 94.3 14.8 2.7 197.3 3.3 216 .8 32.5-4.4 58-17.5 81.9-41.9 17.3-17.7 28.1-36.8 35.2-62.1 4.9-17.6 4.5-142.8 2.5-151.7zm-322.1-63.6c7.8-7.9 10-8.2 58.8-8.2 43.9 0 45.4.1 51.8 3.4 9.3 4.7 13.4 11.3 13.4 21.9 0 9.5-3.8 16.2-12.3 21.6-4.6 2.9-7.3 3.1-50.3 3.3-26.5.2-47.7-.4-50.8-1.2-16.6-4.7-22.8-28.5-10.6-40.8zm191.8 199.8l-14.9 2.4-77.5.9c-68.1.8-87.3-.4-90.9-2-7.1-3.1-13.8-11.7-14.9-19.4-1.1-7.3 2.6-17.3 8.2-22.4 7.1-6.4 10.2-6.6 97.3-6.7 89.6-.1 89.1-.1 97.6 7.8 12.1 11.3 9.5 31.2-4.9 39.4z" />
    </svg>
  );
};

export const IconArticleFill = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M20 22H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1v18a1 1 0 01-1 1zM7 6v4h4V6H7zm0 6v2h10v-2H7zm0 4v2h10v-2H7zm6-9v2h4V7h-4z" />
    </svg>
  );
};

export const IconArticleLine = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M20 22H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1v18a1 1 0 01-1 1zm-1-2V4H5v16h14zM7 6h4v4H7V6zm0 6h10v2H7v-2zm0 4h10v2H7v-2zm6-9h4v2h-4V7z" />
    </svg>
  );
};

export const IconGlobe = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M0 8a8 8 0 1116 0A8 8 0 010 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 005.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 01.64-1.539 6.7 6.7 0 01.597-.933A7.025 7.025 0 002.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 00-.656 2.5h2.49zM4.847 5a12.5 12.5 0 00-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 00-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 00.337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 01-.597-.933A9.268 9.268 0 014.09 12H2.255a7.024 7.024 0 003.072 2.472zM3.82 11a13.652 13.652 0 01-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0013.745 12H11.91a9.27 9.27 0 01-.64 1.539 6.688 6.688 0 01-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 01-.312 2.5zm2.802-3.5a6.959 6.959 0 00-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 00-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 00-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z" />
    </svg>
  );
};

export const Icon402Facebook2 = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-92.4 233.5h-63.9c-50.1 0-59.8 23.8-59.8 58.8v77.1h119.6l-15.6 120.7h-104V912H539.2V602.2H434.9V481.4h104.3v-89c0-103.3 63.1-159.6 155.3-159.6 44.2 0 82.1 3.3 93.2 4.8v107.9z" />
    </svg>
  );
};

export const IconSquareInstagram = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M512 378.7c-73.4 0-133.3 59.9-133.3 133.3S438.6 645.3 512 645.3 645.3 585.4 645.3 512 585.4 378.7 512 378.7zM911.8 512c0-55.2.5-109.9-2.6-165-3.1-64-17.7-120.8-64.5-167.6-46.9-46.9-103.6-61.4-167.6-64.5-55.2-3.1-109.9-2.6-165-2.6-55.2 0-109.9-.5-165 2.6-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6 46.9 46.9 103.6 61.4 167.6 64.5 55.2 3.1 109.9 2.6 165 2.6 55.2 0 109.9.5 165-2.6 64-3.1 120.8-17.7 167.6-64.5 46.9-46.9 61.4-103.6 64.5-167.6 3.2-55.1 2.6-109.8 2.6-165zM512 717.1c-113.5 0-205.1-91.6-205.1-205.1S398.5 306.9 512 306.9 717.1 398.5 717.1 512 625.5 717.1 512 717.1zm213.5-370.7c-26.5 0-47.9-21.4-47.9-47.9s21.4-47.9 47.9-47.9 47.9 21.4 47.9 47.9a47.84 47.84 0 01-47.9 47.9z" />
    </svg>
  );
};

export const IconSquareTwitter = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 448 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 01-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z" />
    </svg>
  );
};

export const IconExplore = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M10 20a10 10 0 110-20 10 10 0 010 20zM7.88 7.88l-3.54 7.78 7.78-3.54 3.54-7.78-7.78 3.54zM10 11a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );
};

export const IconDotsVertical = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M12 16a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2m0-6a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2m0-6a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2z" />
    </svg>
  );
};

export const IconDotsHorizontal = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M16 12a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2m-6 0a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2m-6 0a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2z" />
    </svg>
  );
};

export const IconLocationDot = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 384 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M215.7 499.2C267 435 384 279.4 384 192 384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2 12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z" />
    </svg>
  );
};

export const IconDot2 = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 570 1000"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M110 390c30.667 0 56.667 10.667 78 32s32 47.333 32 78c0 29.333-10.667 55-32 77s-47.333 33-78 33-56.667-10.667-78-32-32-47.333-32-78 10.667-56.667 32-78 47.333-32 78-32m350 0c30.667 0 56.667 10.667 78 32s32 47.333 32 78c0 29.333-11 55-33 77s-47.667 33-77 33c-30.667 0-56.667-10.667-78-32s-32-47.333-32-78 10.667-56.667 32-78 47.333-32 78-32" />
    </svg>
  );
};

export const IconLink = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
      <path
        fill="currentColor"
        d="M14.828 12l1.415 1.414 2.828-2.828a4 4 0 00-5.657-5.657l-2.828 2.828L12 9.172l2.828-2.829a2 2 0 112.829 2.829L14.828 12zM12 14.829l1.414 1.414-2.828 2.828a4 4 0 01-5.657-5.657l2.828-2.828L9.172 12l-2.829 2.829a2 2 0 102.829 2.828L12 14.828z"
      />
      <path
        fill="currentColor"
        d="M14.829 10.586a1 1 0 00-1.415-1.415l-4.242 4.243a1 1 0 101.414 1.414l4.242-4.242z"
      />
    </svg>
  );
};

export const Icon458Linkedin = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM349.3 793.7H230.6V411.9h118.7v381.8zm-59.3-434a68.8 68.8 0 1168.8-68.8c-.1 38-30.9 68.8-68.8 68.8zm503.7 434H675.1V608c0-44.3-.8-101.2-61.7-101.2-61.7 0-71.2 48.2-71.2 98v188.9H423.7V411.9h113.8v52.2h1.6c15.8-30 54.5-61.7 112.3-61.7 120.2 0 142.3 79.1 142.3 181.9v209.4z" />
    </svg>
  );
};

export const IconLinkExternal16 = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10.604 1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.75.75 0 01-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0110.604 1zM3.75 2A1.75 1.75 0 002 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 12.25v-3.5a.75.75 0 00-1.5 0v3.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h3.5a.75.75 0 000-1.5h-3.5z"
      />
    </svg>
  );
};

export const IconShare = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304c0 113.3 81.5 163.9 100.2 174.1 2.5 1.4 5.3 1.9 8.1 1.9 10.9 0 19.7-8.9 19.7-19.7 0-7.5-4.3-14.4-9.8-19.5-9.4-8.9-22.2-26.4-22.2-56.8 0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144a31.76 31.76 0 00-34.4-5.4z" />
    </svg>
  );
};

export const IconMessageReport = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M4 21V8a3 3 0 013-3h10a3 3 0 013 3v6a3 3 0 01-3 3H8l-4 4M12 8v3M12 14v.01" />
    </svg>
  );
};

export const IconHelp = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M11 18h2v-2h-2v2m1-12a4 4 0 00-4 4h2a2 2 0 012-2 2 2 0 012 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5a4 4 0 00-4-4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  );
};

export const IconHelpBox = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M11 18h2v-2h-2v2m1-12a4 4 0 00-4 4h2a2 2 0 012-2 2 2 0 012 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5a4 4 0 00-4-4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  );
};

export const IconTag = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M938 458.8l-29.6-312.6c-1.5-16.2-14.4-29-30.6-30.6L565.2 86h-.4c-3.2 0-5.7 1-7.6 2.9L88.9 557.2a9.96 9.96 0 000 14.1l363.8 363.8c1.9 1.9 4.4 2.9 7.1 2.9s5.2-1 7.1-2.9l468.3-468.3c2-2.1 3-5 2.8-8zM459.7 834.7L189.3 564.3 589 164.6 836 188l23.4 247-399.7 399.7zM680 256c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88zm0 120c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" />
    </svg>
  );
};

export const IconPeople16 = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"
      />
    </svg>
  );
};

export const IconFileDocument = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4c0-1.11.89-2 2-2m9 16v-2H6v2h9m3-4v-2H6v2h12z" />
    </svg>
  );
};

export const IconNewspaperSharp = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="none"
        d="M112 112 H176 A16 16 0 0 1 192 128 V192 A16 16 0 0 1 176 208 H112 A16 16 0 0 1 96 192 V128 A16 16 0 0 1 112 112 z"
      />
      <path d="M468 112h-52v304a32 32 0 0032 32 32 32 0 0032-32V124a12 12 0 00-12-12z" />
      <path d="M431.15 477.75A64.11 64.11 0 01384 416V44a12 12 0 00-12-12H44a12 12 0 00-12 12v380a56 56 0 0056 56h342.85a1.14 1.14 0 00.3-2.25zM96 208v-96h96v96zm224 192H96v-32h224zm0-64H96v-32h224zm0-64H96v-32h224zm0-64h-96v-32h96zm0-64h-96v-32h96z" />
    </svg>
  );
};

export const IconUserAdd = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M678.3 642.4c24.2-13 51.9-20.4 81.4-20.4h.1c3 0 4.4-3.6 2.2-5.6a371.67 371.67 0 00-103.7-65.8c-.4-.2-.8-.3-1.2-.5C719.2 505 759.6 431.7 759.6 349c0-137-110.8-248-247.5-248S264.7 212 264.7 349c0 82.7 40.4 156 102.6 201.1-.4.2-.8.3-1.2.5-44.7 18.9-84.8 46-119.3 80.6a373.42 373.42 0 00-80.4 119.5A373.6 373.6 0 00137 888.8a8 8 0 008 8.2h59.9c4.3 0 7.9-3.5 8-7.8 2-77.2 32.9-149.5 87.6-204.3C357 628.2 432.2 597 512.2 597c56.7 0 111.1 15.7 158 45.1a8.1 8.1 0 008.1.3zM512.2 521c-45.8 0-88.9-17.9-121.4-50.4A171.2 171.2 0 01340.5 349c0-45.9 17.9-89.1 50.3-121.6S466.3 177 512.2 177s88.9 17.9 121.4 50.4A171.2 171.2 0 01683.9 349c0 45.9-17.9 89.1-50.3 121.6C601.1 503.1 558 521 512.2 521zM880 759h-84v-84c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v84h-84c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h84v84c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-84h84c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z" />
    </svg>
  );
};

export const IconAddOutline = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
    </svg>
  );
};

export const IconAddCircleLine = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
  );
};

export const IconLinkAdd = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-name="Layer 1"
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M12.11 15.39l-3.88 3.88a2.47 2.47 0 01-3.5 0 2.46 2.46 0 010-3.5l3.88-3.88a1 1 0 10-1.42-1.42l-3.88 3.89a4.48 4.48 0 006.33 6.33l3.89-3.88a1 1 0 00-1.42-1.42zm-3.28-.22a1 1 0 00.71.29 1 1 0 00.71-.29l4.92-4.92a1 1 0 10-1.42-1.42l-4.92 4.92a1 1 0 000 1.42zM21 18h-1v-1a1 1 0 00-2 0v1h-1a1 1 0 000 2h1v1a1 1 0 002 0v-1h1a1 1 0 000-2zm-4.19-4.47l3.88-3.89a4.48 4.48 0 00-6.33-6.33l-3.89 3.88a1 1 0 101.42 1.42l3.88-3.88a2.47 2.47 0 013.5 0 2.46 2.46 0 010 3.5l-3.88 3.88a1 1 0 000 1.42 1 1 0 001.42 0z" />
    </svg>
  );
};

export const IconDateAdd = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M15 2h2a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V4c0-1.1.9-2 2-2h2V0h2v2h6V0h2v2zM3 6v12h14V6H3zm6 5V9h2v2h2v2h-2v2H9v-2H7v-2h2z" />
    </svg>
  );
};

export const IconImageFill = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M.002 3a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2h-12a2 2 0 01-2-2V3zm1 9v1a1 1 0 001 1h12a1 1 0 001-1V9.5l-3.777-1.947a.5.5 0 00-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 00-.63.062L1.002 12zm5-6.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
    </svg>
  );
};

export const IconBxImageAdd = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z" />
      <path d="M8 11l-3 4h11l-4-6-3 4z" />
      <path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z" />
    </svg>
  );
};

export const IconBxEditAlt = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3l1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z" />
    </svg>
  );
};

export const IconBxCreditCard = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 6h16v2H4V6zm0 12v-6h16.001l.001 6H4z" />
      <path d="M6 14h6v2H6z" />
    </svg>
  );
};

export default IconBxCreditCard;

export const IconCreditCard2 = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M900 150c28 0 51.667 10 71 30s29 43.333 29 70v500c0 28-9.667 51.667-29 71s-43 29-71 29H100c-26.667 0-50-9.667-70-29S0 778 0 750V250c0-26.667 10-50 30-70s43.333-30 70-30h800m0 600V450H100v300h800m0-450v-50H100v50h800M200 556h30v30h-30v-30m180 60h30v-30h30v-30h60v30h-30v30h-30v30h-60v-30m120 30h-30v-30h30v30m-150 0h-60v-30h60v30m30-60v30h-30v-60h60v30h-30m-120 30v30h-60v-30h30v-30h30v-30h60v30h-30v30h-30" />
    </svg>
  );
};

export const IconAccountEdit = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M21.7 13.35l-1 1-2.05-2.05 1-1a.55.55 0 01.77 0l1.28 1.28c.21.21.21.56 0 .77M12 18.94l6.06-6.06 2.05 2.05L14.06 21H12v-2.06M12 14c-4.42 0-8 1.79-8 4v2h6v-1.89l4-4c-.66-.08-1.33-.11-2-.11m0-10a4 4 0 00-4 4 4 4 0 004 4 4 4 0 004-4 4 4 0 00-4-4z" />
    </svg>
  );
};

export const IconInfoCircleFill = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M8 16A8 8 0 108 0a8 8 0 000 16zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );
};

export const IconInformationVariant = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M13.5 4A1.5 1.5 0 0012 5.5 1.5 1.5 0 0013.5 7 1.5 1.5 0 0015 5.5 1.5 1.5 0 0013.5 4m-.36 4.77c-1.19.1-4.44 2.69-4.44 2.69-.2.15-.14.14.02.42.16.27.14.29.33.16.2-.13.53-.34 1.08-.68 2.12-1.36.34 1.78-.57 7.07-.36 2.62 2 1.27 2.61.87.6-.39 2.21-1.5 2.37-1.61.22-.15.06-.27-.11-.52-.12-.17-.24-.05-.24-.05-.65.43-1.84 1.33-2 .76-.19-.57 1.03-4.48 1.7-7.17.11-.64.41-2.04-.75-1.94z" />
    </svg>
  );
};

export const IconArrowTrendUp = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 576 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32h160c17.7 0 32 14.3 32 32v160c0 17.7-14.3 32-32 32s-32-14.3-32-32v-82.7L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160H384z" />
    </svg>
  );
};

export const IconCaretDown = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z" />
    </svg>
  );
};

export const IconChevronDown1 = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"
      />
    </svg>
  );
};

export const IconDownload = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M.5 9.9a.5.5 0 01.5.5v2.5a1 1 0 001 1h12a1 1 0 001-1v-2.5a.5.5 0 011 0v2.5a2 2 0 01-2 2H2a2 2 0 01-2-2v-2.5a.5.5 0 01.5-.5z" />
      <path d="M7.646 11.854a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L8.5 10.293V1.5a.5.5 0 00-1 0v8.793L5.354 8.146a.5.5 0 10-.708.708l3 3z" />
    </svg>
  );
};

export const IconChevronRight = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 384 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
    </svg>
  );
};

export const IconChevronLeft = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 384 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
    </svg>
  );
};

export const IconChevronUp = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
      <path
        fill="currentColor"
        d="M17.657 16.243l1.414-1.414-7.07-7.072-7.072 7.072 1.414 1.414L12 10.586l5.657 5.657z"
      />
    </svg>
  );
};

export const IconChevronDown = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
    </svg>
  );
};

export const IconAvatar = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 15 15" height="1em" width="1em" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M.877 7.5a6.623 6.623 0 1113.246 0 6.623 6.623 0 01-13.246 0zM7.5 1.827a5.673 5.673 0 00-4.193 9.494A4.971 4.971 0 017.5 9.025c1.762 0 3.31.916 4.193 2.296A5.673 5.673 0 007.5 1.827zm3.482 10.152A4.023 4.023 0 007.5 9.975a4.023 4.023 0 00-3.482 2.004A5.648 5.648 0 007.5 13.173c1.312 0 2.52-.446 3.482-1.194zM5.15 6.505a2.35 2.35 0 114.7 0 2.35 2.35 0 01-4.7 0zm2.35-1.4a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const IconQuote = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 330 307"
      height="80"
      width="80"
      {...props}
    >
      <path
        fill="currentColor"
        d="M302.258 176.221C320.678 176.221 329.889 185.432 329.889 203.853V278.764C329.889 297.185 320.678 306.395 302.258 306.395H231.031C212.61 306.395 203.399 297.185 203.399 278.764V203.853C203.399 160.871 207.902 123.415 216.908 91.4858C226.323 59.1472 244.539 30.902 271.556 6.75027C280.562 -1.02739 288.135 -2.05076 294.275 3.68014L321.906 29.4692C328.047 35.2001 326.614 42.1591 317.608 50.3461C303.69 62.6266 292.228 80.4334 283.223 103.766C274.626 126.69 270.328 150.842 270.328 176.221H302.258ZM99.629 176.221C118.05 176.221 127.26 185.432 127.26 203.853V278.764C127.26 297.185 118.05 306.395 99.629 306.395H28.402C9.98126 306.395 0.770874 297.185 0.770874 278.764V203.853C0.770874 160.871 5.27373 123.415 14.2794 91.4858C23.6945 59.1472 41.9106 30.902 68.9277 6.75027C77.9335 -1.02739 85.5064 -2.05076 91.6467 3.68014L119.278 29.4692C125.418 35.2001 123.985 42.1591 114.98 50.3461C101.062 62.6266 89.6 80.4334 80.5942 103.766C71.9979 126.69 67.6997 150.842 67.6997 176.221H99.629Z"
      ></path>
    </svg>
  );
};

export const clapIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-label="clap"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"
      ></path>
    </svg>
  );
};
export const IconHeartFill = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      height=""
      width="18"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 0H24V24H0z" fill="none"></path>
      <path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"></path>
    </svg>
  );
};

export const IconCloud = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier" {...props}>
        <path
          d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15"
          stroke="#000000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>{" "}
      </g>
    </svg>
  );
};

export const IconFile = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="#000000"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path>
        <path d="M18.153 6h-.009v5.342H23.5v-.002z"></path>
      </g>
    </svg>
  );
};

export const IconMinutemailer = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M17.187 19.181L24 4.755 0 12.386l9.196 1.963.043 4.896 2.759-2.617-2.147-2.076 7.336 4.63z" />
    </svg>
  );
};

export const IconCalendarEventFill = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M17 3h4a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1h4V1h2v2h6V1h2v2zM4 9v10h16V9H4zm2 4h5v4H6v-4z" />
    </svg>
  );
};

export const IconSpeaker = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
        fillRule="evenodd"
      ></path>
    </svg>
  );
};

export const IconSwitchAccountIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-label="Switch Accounts"
      color="#fff"
      fill="#fff"
      height="16"
      role="img"
      viewBox="0 0 24 24"
      width="16"
      {...props}
    >
      <path d="M8 8.363a1 1 0 00-1-1H4.31a8.977 8.977 0 0114.054-1.727 1 1 0 101.414-1.414A11.003 11.003 0 003 5.672V3.363a1 1 0 10-2 0v5a1 1 0 001 1h5a1 1 0 001-1zm14 6.274h-5a1 1 0 000 2h2.69a8.977 8.977 0 01-14.054 1.727 1 1 0 00-1.414 1.414A11.004 11.004 0 0021 18.33v2.307a1 1 0 002 0v-5a1 1 0 00-1-1z"></path>
    </svg>
  );
};

export const userIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      height="20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        stroke-linejoin="round"
        fill="#707277"
        stroke-linecap="round"
        stroke-width="2"
        stroke="#707277"
        d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z"
      ></path>
      <path
        stroke-width="2"
        fill="#707277"
        stroke="#707277"
        d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z"
      ></path>
    </svg>
  );
};

export const IconBxsCommentDetail = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M20 1.999H4c-1.103 0-2 .897-2 2v18l4-4h14c1.103 0 2-.897 2-2v-12c0-1.103-.897-2-2-2zm-6 11H7v-2h7v2zm3-4H7v-2h10v2z" />
    </svg>
  );
};

export const IconLike = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 00-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 00471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z" />
    </svg>
  );
};

export const IconDislike = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4a66.1 66.1 0 00-26.5-5.4H273v428h.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM112 132v364c0 17.7 14.3 32 32 32h65V100h-65c-17.7 0-32 14.3-32 32z" />
    </svg>
  );
};

export const CircleLoaderIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="25 25 50 50" {...props}>
      <circle
        r="20"
        cy="50"
        cx="50"
        style={{
          fill: "none",
          stroke: "hsl(214, 97%, 59%)",
          strokeWidth: "2",
          strokeDasharray: "1, 200",
          strokeDashoffset: "0",
          strokeLinecap: "round",
          animation: "dash4 1.5s ease-in-out infinite",
        }}
      ></circle>
    </svg>
  );
};

export const IconFilter = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.17375 2.39015H15.5334C16.0239 2.39015 16.4216 2.78782 16.4216 3.27835C16.4216 3.76888 16.0239 4.16654 15.5334 4.16654H7.17375C6.80707 5.20032 5.81982 5.94292 4.66194 5.94292C3.50406 5.94292 2.51678 5.20032 2.15013 4.16654H0.896005C0.405474 4.16654 0.0078125 3.76888 0.0078125 3.27835C0.0078125 2.78782 0.405474 2.39015 0.896005 2.39015H2.15013C2.51681 1.35637 3.50406 0.61377 4.66194 0.61377C5.81982 0.61377 6.80707 1.35637 7.17375 2.39015ZM3.77465 3.27873C3.77465 3.76848 4.17309 4.16693 4.66284 4.16693C5.15259 4.16693 5.55103 3.76848 5.55103 3.27873C5.55103 2.78898 5.15259 2.39054 4.66284 2.39054C4.17309 2.39054 3.77465 2.78898 3.77465 3.27873ZM7.17375 12.338H15.5334C16.0239 12.338 16.4216 12.7357 16.4216 13.2262C16.4216 13.7168 16.0239 14.1144 15.5334 14.1144H7.17375C6.80707 15.1482 5.81982 15.8908 4.66194 15.8908C3.50406 15.8908 2.51678 15.1482 2.15013 14.1144H0.896005C0.405474 14.1144 0.0078125 13.7168 0.0078125 13.2262C0.0078125 12.7357 0.405474 12.338 0.896005 12.338H2.15013C2.51681 11.3043 3.50406 10.5617 4.66194 10.5617C5.81982 10.5617 6.8071 11.3043 7.17375 12.338ZM3.77465 13.2264C3.77465 13.7161 4.17309 14.1146 4.66284 14.1146C5.15259 14.1146 5.55103 13.7161 5.55103 13.2264C5.55103 12.7366 5.15259 12.3382 4.66284 12.3382C4.17309 12.3382 3.77465 12.7366 3.77465 13.2264ZM15.5334 7.36416H14.2793C13.9126 6.33037 12.9254 5.58777 11.7675 5.58777C10.6096 5.58777 9.62235 6.33037 9.25567 7.36416H0.896005C0.405474 7.36416 0.0078125 7.76182 0.0078125 8.25235C0.0078125 8.74288 0.405474 9.14054 0.896005 9.14054H9.25567C9.62232 10.1743 10.6096 10.9169 11.7675 10.9169C12.9254 10.9169 13.9126 10.1743 14.2793 9.14054H15.5334C16.0239 9.14054 16.4216 8.74288 16.4216 8.25235C16.4216 7.76182 16.0239 7.36416 15.5334 7.36416ZM11.7683 9.14069C11.2786 9.14069 10.8801 8.74225 10.8801 8.2525C10.8801 7.76275 11.2786 7.36431 11.7683 7.36431C12.2581 7.36431 12.6565 7.76275 12.6565 8.2525C12.6565 8.74225 12.2581 9.14069 11.7683 9.14069Z"
        fill="#1D262D"
      ></path>
    </svg>
  );
};

export const IconPinOff = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M2 5.27L3.28 4 20 20.72 18.73 22l-5.93-5.93V22h-1.6v-6H6v-2l2-2v-.73l-6-6M16 12l2 2v2h-.18L8 6.18V4H7V2h10v2h-1v8z" />
    </svg>
  );
};

export const IconPin = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
    </svg>
  );
};

export const IconBxsPin = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M15 11.586V6h2V4a2 2 0 00-2-2H9a2 2 0 00-2 2v2h2v5.586l-2.707 1.707A.996.996 0 006 14v2a1 1 0 001 1h4v3l1 2 1-2v-3h4a1 1 0 001-1v-2a.996.996 0 00-.293-.707L15 11.586z" />
    </svg>
  );
};

export const IconChevronForwardOutline = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={48}
        d="M184 112l144 144-144 144"
      />
    </svg>
  );
};

export const IconShareForwardFill = function (
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M13 14h-2a8.999 8.999 0 00-7.968 4.81A10.136 10.136 0 013 18C3 12.477 7.477 8 13 8V3l10 8-10 8v-5z" />
    </svg>
  );
};

export const IconUpdate = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1a6.887 6.887 0 000 9.8c2.73 2.7 7.15 2.7 9.88 0 1.36-1.35 2.04-2.92 2.04-4.9h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58a8.987 8.987 0 0112.65 0L21 3v7.12M12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z" />
    </svg>
  );
};

export const IconSchool = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 640 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M337.8 5.4c-10.8-7.2-24.8-7.2-35.6 0l-139 92.7L37.6 126C15.6 130.9 0 150.3 0 172.8V464c0 26.5 21.5 48 48 48h544c26.5 0 48-21.5 48-48V172.8c0-22.5-15.6-42-37.6-46.9L476.8 98.1l-139-92.7zM256 416c0-35.3 28.7-64 64-64s64 28.7 64 64v96H256v-96zM96 192h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16v-64c0-8.8 7.2-16 16-16zm400 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-64zM96 320h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16v-64c0-8.8 7.2-16 16-16zm400 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16v-64zm-88-160c0 48.6-39.4 88-88 88s-88-39.4-88-88 39.4-88 88-88 88 39.4 88 88zm-88-48c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-16v-16c0-8.8-7.2-16-16-16z" />
    </svg>
  );
};

export const IconBookshelf = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M9 3v15h3V3H9m3 2l4 13 3-1-4-13-3 1M5 5v13h3V5H5M3 19v2h18v-2H3z" />
    </svg>
  );
};

export const IconLogout = function (props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 900 1000"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M502 850V750h98v100c0 26.667-9.667 50-29 70s-43 30-71 30H100c-26.667 0-50-10-70-30S0 876.667 0 850V150c0-28 10-51.667 30-71s43.333-29 70-29h400c28 0 51.667 9.667 71 29s29 43 29 71v150h-98V150H100v700h402m398-326L702 720V600H252V450h450V330l198 194" />
    </svg>
  );
};

export const IconVideoTwentyFour = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M1.75 4.5a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h20.5a.25.25 0 00.25-.25V4.75a.25.25 0 00-.25-.25H1.75zM0 4.75C0 3.784.784 3 1.75 3h20.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0122.25 21H1.75A1.75 1.75 0 010 19.25V4.75z"
      />
      <path d="M9 15.584V8.416a.5.5 0 01.77-.42l5.576 3.583a.5.5 0 010 .842L9.77 16.005a.5.5 0 01-.77-.42z" />
    </svg>
  );
};

export const IconLock = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z" />
    </svg>
  );
};

export const IconShieldLock = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M5.338 1.59a61.44 61.44 0 00-2.837.856.481.481 0 00-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 002.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 00.101.025.615.615 0 00.1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 002.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 00-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 011.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 01-2.517 2.453 7.159 7.159 0 01-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 01-1.048-.625 11.777 11.777 0 01-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 012.185 1.43 62.456 62.456 0 015.072.56z" />
      <path d="M9.5 6.5a1.5 1.5 0 01-1 1.415l.385 1.99a.5.5 0 01-.491.595h-.788a.5.5 0 01-.49-.595l.384-1.99a1.5 1.5 0 112-1.415z" />
    </svg>
  );
};

export const IconClockRotateLeft2 = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24h110.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24v104c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z" />
    </svg>
  );
};

export const IconUnlock = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M832 464H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v68c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-68c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zm-40 376H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z" />
    </svg>
  );
};

export const IconPlayCircle = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z" />
      <path d="M6.271 5.055a.5.5 0 01.52.038l3.5 2.5a.5.5 0 010 .814l-3.5 2.5A.5.5 0 016 10.5v-5a.5.5 0 01.271-.445z" />
    </svg>
  );
};

export const IconCirclePlay = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0s256 114.6 256 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9v176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
    </svg>
  );
};

export const IconThemeLightDark = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M7.5 2c-1.79 1.15-3 3.18-3 5.5s1.21 4.35 3.03 5.5C4.46 13 2 10.54 2 7.5A5.5 5.5 0 017.5 2m11.57 1.5l1.43 1.43L4.93 20.5 3.5 19.07 19.07 3.5m-6.18 2.43L11.41 5 9.97 6l.42-1.7L9 3.24l1.75-.12.58-1.65L12 3.1l1.73.03-1.35 1.13.51 1.67m-3.3 3.61l-1.16-.73-1.12.78.34-1.32-1.09-.83 1.36-.09.45-1.29.51 1.27 1.36.03-1.05.87.4 1.31M19 13.5a5.5 5.5 0 01-5.5 5.5c-1.22 0-2.35-.4-3.26-1.07l7.69-7.69c.67.91 1.07 2.04 1.07 3.26m-4.4 6.58l2.77-1.15-.24 3.35-2.53-2.2m4.33-2.7l1.15-2.77 2.2 2.54-3.35.23m1.15-4.96l-1.14-2.78 3.34.24-2.2 2.54M9.63 18.93l2.77 1.15-2.53 2.19-.24-3.34z" />
    </svg>
  );
};

export const IconCloudOffline16 = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M7.25 2c-.69 0-1.351.13-1.957.371a.75.75 0 10.554 1.394c.43-.17.903-.265 1.403-.265a3.72 3.72 0 013.541 2.496.75.75 0 00.709.504c1.676 0 3 1.324 3 3a3 3 0 01-.681 1.92.75.75 0 001.156.955A4.496 4.496 0 0016 9.5a4.472 4.472 0 00-3.983-4.471A5.222 5.222 0 007.25 2z" />
      <path
        fillRule="evenodd"
        d="M.72 1.72a.75.75 0 011.06 0l2.311 2.31c.03.025.056.052.08.08l8.531 8.532a.785.785 0 01.035.034l2.043 2.044a.75.75 0 11-1.06 1.06l-1.8-1.799a4.64 4.64 0 01-.42.019h-8A3.475 3.475 0 010 10.5c0-1.41.809-2.614 2.001-3.17a5.218 5.218 0 01.646-2.622L.72 2.78a.75.75 0 010-1.06zM3.5 7.25c0-.505.096-.983.271-1.418L10.44 12.5H3.5c-1.124 0-2-.876-2-2 0-.95.624-1.716 1.484-1.936a.75.75 0 00.557-.833A4.1 4.1 0 013.5 7.25z"
      />
    </svg>
  );
};

export const IconBxSkipPrevious = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M16 7l-7 5 7 5zm-7 5V7H7v10h2z" />
    </svg>
  );
};

export const IconSkipNext = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M16 18h2V6h-2M6 18l8.5-6L6 6v12z" />
    </svg>
  );
};

export const IconPauseCircle = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm-32 272a16 16 0 01-32 0V192a16 16 0 0132 0zm96 0a16 16 0 01-32 0V192a16 16 0 0132 0z" />
    </svg>
  );
};

export const IconVolumeUpFill = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M11.536 14.01A8.473 8.473 0 0014.026 8a8.473 8.473 0 00-2.49-6.01l-.708.707A7.476 7.476 0 0113.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
      <path d="M10.121 12.596A6.48 6.48 0 0012.025 8a6.48 6.48 0 00-1.904-4.596l-.707.707A5.483 5.483 0 0111.025 8a5.483 5.483 0 01-1.61 3.89l.706.706z" />
      <path d="M8.707 11.182A4.486 4.486 0 0010.025 8a4.486 4.486 0 00-1.318-3.182L8 5.525A3.489 3.489 0 019.025 8 3.49 3.49 0 018 10.475l.707.707zM6.717 3.55A.5.5 0 017 4v8a.5.5 0 01-.812.39L3.825 10.5H1.5A.5.5 0 011 10V6a.5.5 0 01.5-.5h2.325l2.363-1.89a.5.5 0 01.529-.06z" />
    </svg>
  );
};

export const IconVolumeMuteFill = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M6.717 3.55A.5.5 0 017 4v8a.5.5 0 01-.812.39L3.825 10.5H1.5A.5.5 0 011 10V6a.5.5 0 01.5-.5h2.325l2.363-1.89a.5.5 0 01.529-.06zm7.137 2.096a.5.5 0 010 .708L12.207 8l1.647 1.646a.5.5 0 01-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 01-.708-.708L10.793 8 9.146 6.354a.5.5 0 11.708-.708L11.5 7.293l1.646-1.647a.5.5 0 01.708 0z" />
    </svg>
  );
};

export const IconRewindFill = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 10.667l9.223-6.149a.5.5 0 01.777.416v14.132a.5.5 0 01-.777.416L12 13.333v5.733a.5.5 0 01-.777.416L.624 12.416a.5.5 0 010-.832l10.599-7.066a.5.5 0 01.777.416v5.733z" />
    </svg>
  );
};

export const IconFastForwardFill = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M7.596 7.304a.802.802 0 010 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
      <path d="M15.596 7.304a.802.802 0 010 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
    </svg>
  );
};




export const IconPaste = (props: React.SVGProps<SVGSVGElement>)=> {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M160 0c-23.7 0-44.4 12.9-55.4 32H48C21.5 32 0 53.5 0 80v320c0 26.5 21.5 48 48 48h144V176c0-44.2 35.8-80 80-80h48V80c0-26.5-21.5-48-48-48h-56.6c-11-19.1-31.7-32-55.4-32zm112 128c-26.5 0-48 21.5-48 48v288c0 26.5 21.5 48 48 48h192c26.5 0 48-21.5 48-48V256h-96c-17.7 0-32-14.3-32-32v-96H272zM160 88c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24zm256 40v96h96l-96-96z" />
    </svg>
  );
}



export const IconImageEditOutline = (props: React.SVGProps<SVGSVGElement>) =>{
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M22.7 14.3l-1 1-2-2 1-1c.1-.1.2-.2.4-.2.1 0 .3.1.4.2l1.3 1.3c.1.2.1.5-.1.7M13 19.9V22h2.1l6.1-6.1-2-2-6.2 6m-1.79-4.07l-1.96-2.36L6.5 17h6.62l2.54-2.45-1.7-2.26-2.75 3.54M11 19.9v-.85l.05-.05H5V5h14v6.31l2-1.93V5a2 2 0 00-2-2H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h6v-1.1z" />
    </svg>
  );
}



export const IconImage = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zM5 18a1 1 0 01-1-1v-2.42l3.3-3.29a1 1 0 011.4 0L15.41 18zm15-1a1 1 0 01-1 1h-.77l-3.81-3.83.88-.88a1 1 0 011.4 0l3.3 3.29zm0-3.24l-1.88-1.87a3.06 3.06 0 00-4.24 0l-.88.88-2.88-2.88a3.06 3.06 0 00-4.24 0L4 11.76V7a1 1 0 011-1h14a1 1 0 011 1z" />
    </svg>
  );
}

