package org.vander.core.security.impl.tink

import org.vander.core.security.api.CryptoEngine

class TinkCryptoEngine : CryptoEngine {
    override suspend fun encrypt(
        plainText: String,
        associatedData: ByteArray?,
    ): ByteArray {
        TODO("Not yet implemented")
    }

    override suspend fun decrypt(
        cipherText: ByteArray,
        associatedData: ByteArray?,
    ): ByteArray {
        TODO("Not yet implemented")
    }
}
