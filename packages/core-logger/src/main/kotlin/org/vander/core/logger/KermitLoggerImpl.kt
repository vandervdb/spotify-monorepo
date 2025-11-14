package org.vander.core.logger

import co.touchlab.kermit.LoggerConfig
import co.touchlab.kermit.StaticConfig
import co.touchlab.kermit.platformLogWriter
import co.touchlab.kermit.Logger as KermitLogger

class KermitLoggerImpl(
    private val baseTag: String = "VanderApp",
    private val config: LoggerConfig = StaticConfig(logWriterList = listOf(platformLogWriter()))
) : Logger {

    private val logger = KermitLogger(config).withTag(baseTag)

    override fun d(tag: String, message: String) {
        logger.withTag(tag).d { message }
    }

    override fun i(tag: String, message: String) {
        logger.withTag(tag).i { message }
    }

    override fun w(tag: String, message: String) {
        logger.withTag(tag).w { message }
    }

    override fun e(tag: String, message: String, throwable: Throwable?) {
        logger.withTag(tag).e(throwable) { message }
    }
}
