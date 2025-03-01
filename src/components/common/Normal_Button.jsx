import PropTypes from 'prop-types';

const Normal_Button = ({custom_class, onClick, text='button'}) => {
    return (
        <>
            <button className={`p-2 px-12 rounded-md cursor-pointer border ${custom_class}`} onClick={onClick}>
                {text}
            </button>
        </>
    )
}

Normal_Button.propTypes = {
    custom_class: PropTypes.string,
    onClick: PropTypes.func,
    text: PropTypes.string,
};

export default Normal_Button