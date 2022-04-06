MAX_LEN_FELT = 31

from starkware.starknet.compiler.compile import get_selector_from_name


def str_to_felt(text):
    if len(text) > MAX_LEN_FELT:
        raise Exception("Text length too long to convert to felt.")

    return int.from_bytes(text.encode(), "big")


def felt_to_str(felt):
    length = (felt.bit_length() + 7) // 8
    return felt.to_bytes(length, byteorder="big").decode("utf-8")


def str_to_felt_array(text):
    return [str_to_felt(text[i:i+MAX_LEN_FELT]) for i in range(0, len(text), MAX_LEN_FELT)]


def uint256_to_int(uint256):
    return uint256[0] + uint256[1]*2**128


def uint256(val):
    return (val & 2**128-1, (val & (2**256-2**128)) >> 128)


def hex_to_felt(val):
    return int(val, 16)

if __name__ == '__main__':
    print("L2_NFT " + str(hex_to_felt('0x07580ca4a09e40ab111e8ad0193013c3bf087cc3107c44e34257a454bb41ab00')))    
    print(get_selector_from_name('BCPT_mint'))