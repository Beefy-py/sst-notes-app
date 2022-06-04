import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import LoaderButton from "../common/LoaderButton";
import { useFormFields } from "../lib/hooksLib";

export default function BillingForm({ loading, onSubmit, method }) {
  const stripe = useStripe();
  const elements = useElements();
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    storage: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  loading = isProcessing || loading;

  function validateForm() {
    return (
      stripe &&
      elements &&
      fields.name !== "" &&
      fields.storage !== "" &&
      isCardComplete
    );
  }

  function handleMopePayment(e) {
    e.preventDefault();
    console.log("Payed with mope");
    onSubmit(fields.storage, {});
  }

  async function handleStripePayment(event) {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);

    setIsProcessing(false);

    onSubmit(fields.storage, { token, error });
  }

  return (
    <form className="BillingForm">
      <div className="mb-4">
        <label
          for="storage"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Storage
        </label>
        <input
          type="number"
          id="storage"
          min="0"
          value={fields.storage}
          onChange={handleFieldChange}
          placeholder="Number of notes to store"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      {method === "mope" ? (
        <button onClick={handleMopePayment}>
          <svg
            width="130px"
            height="40px"
            viewBox="0 0 160 48"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <title>Button/Small/Blue/button_blue_small160</title>
            <desc>Created with Sketch.</desc>
            <g
              id="Payment-Buttons"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="Button/Small/Blue/button_blue_small160">
                <path
                  d="M149.744464,0.5 L9.89839527,0.501308622 C7.14664506,0.521916777 5.81771318,0.764794467 4.59235117,1.37320991 L4.32841662,1.50943741 C3.11184715,2.16006588 2.16006588,3.11184715 1.50943741,4.32841662 C0.761095152,5.72769499 0.5,7.07975665 0.5,10.2555408 L0.499984313,38.1013886 C0.521785909,40.8536023 0.76492325,42.1825462 1.37320991,43.4076488 L1.50943741,43.6715834 C2.16006588,44.8881529 3.11184715,45.8399341 4.32841662,46.4905626 C5.63346408,47.1885096 6.86423837,47.452694 9.55315581,47.4947309 L10.2555408,47.5 L149.744459,47.5 C152.7373,47.5 154.135225,47.2585751 155.407649,46.6267901 L155.671583,46.4905626 C156.888153,45.8399341 157.839934,44.8881529 158.490563,43.6715834 C159.18851,42.3665359 159.452694,41.1357616 159.494731,38.4468442 L159.5,37.7444592 L159.5,10.2555408 C159.5,7.26269986 159.258575,5.86477455 158.62679,4.59235117 L158.490563,4.32841662 C157.839934,3.11184715 156.888153,2.16006588 155.671583,1.50943741 C154.272305,0.761095152 152.920243,0.5 149.744459,0.5 Z"
                  id="bg"
                  strokeOpacity="0.08"
                  stroke="#000000"
                  fill="#004C99"
                ></path>
                <path
                  d="M143.129524,16.0110417 C146.252402,16.2230319 148.146872,14.9115045 148.81281,12.0769528 L148.81281,12.0769528 C148.437911,12.0256509 148.080895,12 147.741143,12 L147.741143,12 C145.288519,12 143.751189,13.3371783 143.129524,16.0110417 L143.129524,16.0110417 Z"
                  id="Clip-11"
                  fill="#7FB022"
                ></path>
                <path
                  d="M147.80622,17.5721108 C148.419006,17.5721108 148.62964,17.7827444 148.62964,18.3764156 L148.62964,20.0999611 C148.62964,20.7127472 148.419006,20.9235041 147.80622,20.9235041 L142.750643,20.9235041 L142.750643,22.6276882 L146.791282,22.6276882 C147.403944,22.6276882 147.614701,22.8383218 147.614701,23.431993 L147.614701,25.1555385 C147.614701,25.7684479 147.403944,25.9790815 146.791282,25.9790815 L142.750643,25.9790815 L142.750643,27.8174397 L147.978624,27.8174397 C148.572295,27.8174397 148.782929,28.0089584 148.782929,28.6217445 L148.782929,30.3644049 C148.782929,30.9580761 148.572295,31.1687097 147.978624,31.1687097 L139.78241,31.1687097 C139.169624,31.1687097 138.95899,30.9580761 138.95899,30.3644049 L138.95899,18.3764156 C138.95899,17.7827444 139.169624,17.5721108 139.78241,17.5721108 L147.80622,17.5721108 Z M117.668973,17.3717498 C121.30746,17.3717498 123.339186,19.3545178 123.339186,22.5416465 L123.339186,25.9141279 C123.339186,29.10138 121.30746,31.084148 117.668973,31.084148 C114.011988,31.084148 111.99876,29.10138 111.99876,25.9141279 L111.99876,22.5416465 C111.99876,19.3545178 114.011988,17.3717498 117.668973,17.3717498 Z M98.5835795,17.572752 C99.2190567,17.572752 99.4618774,17.6664766 99.6861997,18.1538444 L102.769615,24.2098083 L105.852783,18.1727126 C106.095727,17.6477317 106.282683,17.572752 106.899415,17.572752 L108.767987,17.572752 C109.366098,17.572752 109.571676,17.7602012 109.571676,18.3414169 L109.571676,30.1156895 C109.571676,30.6967819 109.366098,30.884231 108.767987,30.884231 L106.731204,30.884231 C106.151839,30.884231 105.946261,30.6967819 105.946261,30.1156895 L105.946261,27.4158052 C105.946261,26.1783942 106.058361,24.997218 106.768448,22.5036511 L106.581738,22.5036511 C106.376161,23.1223566 105.703441,24.8472587 105.310907,25.6159235 L104.245777,27.7344688 C104.058944,28.1094904 103.872112,28.2594497 103.367479,28.2594497 L102.115516,28.2594497 C101.610883,28.2594497 101.424051,28.1469802 101.218473,27.7344688 L100.115976,25.6159235 C99.7235662,24.8847485 99.1442004,23.1785913 98.9573679,22.5036511 L98.7705353,22.5036511 C99.416347,25.09554 99.5283287,26.0630949 99.5362539,27.2808872 L99.5367337,30.1156895 C99.5367337,30.6967819 99.3311563,30.884231 98.7331688,30.884231 L96.827107,30.884231 C96.2289963,30.884231 96.042287,30.6967819 96.042287,30.1156895 L96.042287,18.3414169 C96.042287,17.7602012 96.2289963,17.572752 96.827107,17.572752 L98.5835795,17.572752 Z M131.999312,17.572752 C134.914516,17.572752 136.820578,19.2789092 136.820578,22.2598439 C136.820578,25.2035354 134.933138,26.8908243 132.036679,26.8908243 L129.738207,26.8908243 L129.738207,30.0968213 C129.738207,30.6780369 129.551374,30.884231 128.953387,30.884231 L126.841748,30.884231 C126.24376,30.884231 126.056928,30.6780369 126.056928,30.0968213 L126.056928,18.3601618 C126.056928,17.7789461 126.24376,17.572752 126.841748,17.572752 L131.999312,17.572752 Z M48.856,21.08 C50.616,21.08 52.232,21.784 52.232,24.008 L52.232,24.008 L52.232,29 L50.2,29 L50.2,28.2 C49.672,28.824 48.76,29.192 47.752,29.192 C46.52,29.192 45.064,28.36 45.064,26.632 C45.064,24.824 46.52,24.136 47.752,24.136 C48.776,24.136 49.688,24.472 50.2,25.08 L50.2,25.08 L50.2,24.04 C50.2,23.256 49.528,22.744 48.504,22.744 C47.672,22.744 46.904,23.048 46.248,23.656 L46.248,23.656 L45.48,22.296 C46.424,21.464 47.64,21.08 48.856,21.08 Z M26.12,21.08 C28.424,21.08 29.992,22.808 29.992,25.336 L29.992,25.336 L29.992,25.784 L24.248,25.784 C24.376,26.76 25.16,27.576 26.472,27.576 C27.128,27.576 28.04,27.288 28.536,26.808 L28.536,26.808 L29.432,28.12 C28.664,28.824 27.448,29.192 26.248,29.192 C23.896,29.192 22.12,27.608 22.12,25.128 C22.12,22.888 23.768,21.08 26.12,21.08 Z M33.912,19.16 L33.912,21.272 L35.48,21.272 L35.48,23.048 L33.912,23.048 L33.912,26.536 C33.912,27.016 34.168,27.384 34.616,27.384 C34.92,27.384 35.208,27.272 35.32,27.16 L35.32,27.16 L35.752,28.696 C35.448,28.968 34.904,29.192 34.056,29.192 C32.632,29.192 31.864,28.456 31.864,27.08 L31.864,27.08 L31.864,23.048 L30.584,23.048 L30.584,21.272 L31.864,21.272 L31.864,19.16 L33.912,19.16 Z M87.32,19.16 L87.32,21.272 L88.888,21.272 L88.888,23.048 L87.32,23.048 L87.32,26.536 C87.32,27.016 87.576,27.384 88.024,27.384 C88.328,27.384 88.616,27.272 88.728,27.16 L88.728,27.16 L89.16,28.696 C88.856,28.968 88.312,29.192 87.464,29.192 C86.04,29.192 85.272,28.456 85.272,27.08 L85.272,27.08 L85.272,23.048 L83.992,23.048 L83.992,21.272 L85.272,21.272 L85.272,19.16 L87.32,19.16 Z M40.168,21.08 C41.928,21.08 43.544,21.784 43.544,24.008 L43.544,24.008 L43.544,29 L41.512,29 L41.512,28.2 C40.984,28.824 40.072,29.192 39.064,29.192 C37.832,29.192 36.376,28.36 36.376,26.632 C36.376,24.824 37.832,24.136 39.064,24.136 C40.088,24.136 41,24.472 41.512,25.08 L41.512,25.08 L41.512,24.04 C41.512,23.256 40.84,22.744 39.816,22.744 C38.984,22.744 38.216,23.048 37.56,23.656 L37.56,23.656 L36.792,22.296 C37.736,21.464 38.952,21.08 40.168,21.08 Z M79.528,21.08 C81.832,21.08 83.4,22.808 83.4,25.336 L83.4,25.336 L83.4,25.784 L77.656,25.784 C77.784,26.76 78.568,27.576 79.88,27.576 C80.536,27.576 81.448,27.288 81.944,26.808 L81.944,26.808 L82.84,28.12 C82.072,28.824 80.856,29.192 79.656,29.192 C77.304,29.192 75.528,27.608 75.528,25.128 C75.528,22.888 77.176,21.08 79.528,21.08 Z M71.752,21.08 C73.176,21.08 74.024,21.832 74.024,23.416 L74.024,23.416 L74.024,29 L71.976,29 L71.976,24.12 C71.976,23.4 71.656,22.888 70.824,22.888 C70.104,22.888 69.512,23.368 69.224,23.784 L69.224,23.784 L69.224,29 L67.176,29 L67.176,24.12 C67.176,23.4 66.856,22.888 66.024,22.888 C65.32,22.888 64.728,23.368 64.424,23.8 L64.424,23.8 L64.424,29 L62.392,29 L62.392,21.272 L64.424,21.272 L64.424,22.28 C64.744,21.816 65.768,21.08 66.952,21.08 C68.088,21.08 68.808,21.608 69.096,22.488 C69.544,21.784 70.568,21.08 71.752,21.08 Z M56.28,18.328 L56.28,29 L54.248,29 L54.248,18.328 L56.28,18.328 Z M17.672,18.328 C19.704,18.328 20.744,19.624 20.744,21.048 C20.744,22.392 19.912,23.288 18.904,23.496 C20.04,23.672 20.952,24.776 20.952,26.12 C20.952,27.72 19.88,29 17.848,29 L17.848,29 L12.056,29 L12.056,18.328 Z M117.668973,20.61462 C116.376191,20.61462 115.637246,21.2260495 115.637246,22.3934137 L115.637246,26.0623608 C115.637246,27.2298483 116.376191,27.8412778 117.668973,27.8412778 C118.943381,27.8412778 119.682078,27.2298483 119.682078,26.0623608 L119.682078,22.3934137 C119.682078,21.2260495 118.943381,20.61462 117.668973,20.61462 Z M39.88,25.512 C39.08,25.512 38.424,25.928 38.424,26.68 C38.424,27.4 39.08,27.816 39.88,27.816 C40.536,27.816 41.176,27.592 41.512,27.144 L41.512,27.144 L41.512,26.184 C41.176,25.736 40.536,25.512 39.88,25.512 Z M48.568,25.512 C47.768,25.512 47.112,25.928 47.112,26.68 C47.112,27.4 47.768,27.816 48.568,27.816 C49.224,27.816 49.864,27.592 50.2,27.144 L50.2,27.144 L50.2,26.184 C49.864,25.736 49.224,25.512 48.568,25.512 Z M17.256,24.552 L14.328,24.552 L14.328,27.032 L17.256,27.032 C18.12,27.032 18.632,26.568 18.632,25.8 C18.632,25.128 18.152,24.552 17.256,24.552 L17.256,24.552 Z M26.12,22.696 C24.856,22.696 24.312,23.64 24.216,24.408 L24.216,24.408 L28.024,24.408 C27.976,23.672 27.464,22.696 26.12,22.696 Z M79.528,22.696 C78.264,22.696 77.72,23.64 77.624,24.408 L77.624,24.408 L81.432,24.408 C81.384,23.672 80.872,22.696 79.528,22.696 Z M131.588157,20.8351071 L130.331385,20.8351071 L130.331385,23.6098477 L131.588157,23.6098477 C132.466455,23.6098477 132.989833,23.0661218 132.989833,22.2224774 C132.989833,21.3974545 132.4852,20.8351071 131.588157,20.8351071 Z M17.176,20.28 L14.328,20.28 L14.328,22.6 L17.176,22.6 C17.944,22.6 18.424,22.12 18.424,21.448 C18.424,20.776 17.944,20.28 17.176,20.28 L17.176,20.28 Z"
                  id="Combined-Shape"
                  fill="#FFFFFF"
                  fillRule="nonzero"
                ></path>
              </g>
            </g>
          </svg>
        </button>
      ) : (
        <>
          {" "}
          <div className="mb-4">
            <label
              for="cardholder"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Cardholder&apos;s name
            </label>
            <input
              type="text"
              id="name"
              value={fields.name}
              onChange={handleFieldChange}
              placeholder="Name on the card"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Credit Card Info
          </label>
          <CardElement
            className="card-field mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setIsCardComplete(e.complete)}
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#495057",
                  fontFamily: "'Open Sans', sans-serif",
                },
              },
            }}
          />
          <button
            className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            onClick={handleStripePayment}
            disabled={!validateForm()}
          >
            <span className="mr-2">Purchase</span>
            {loading && (
              <svg
                role="status"
                className="inline w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                ></path>
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                ></path>
              </svg>
            )}
          </button>
        </>
      )}
    </form>
  );
}
