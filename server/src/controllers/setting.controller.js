import { Setting } from "../models/index.js";
import fs from "fs";
import path from "path";

export default {
    async getSettings(req, res) {
        try {
            let settings = await Setting.findOne();
            if (!settings) {
                settings = await Setting.create({
                    siteName: "Pinjamku",
                    landingTitle: "Sistem Peminjaman Alat Digital yang Terstruktur dan Transparan",
                    landingSubtitle: "Platform modern dengan sistem 3 level pengguna yang memudahkan pengelolaan, monitoring, dan pelaporan peminjaman alat secara real-time.",
                    landingDescription: "Website ini digunakan untuk mencatat dan mengelola seluruh proses peminjaman dan pengembalian alat secara real-time.",
                });
            }
            res.status(200).json(settings);
        } catch (error) {
            res.status(500).json({
                message: "Failed to retrieve settings data.",
                error: error.message,
            });
        }
    },

    async updateSettings(req, res) {
        try {
            const { siteName, landingTitle, landingSubtitle, landingDescription } = req.body;

            let settings = await Setting.findOne();
            if (!settings) {
                settings = await Setting.create({
                    siteName: "Pinjamku",
                    landingTitle: "Sistem Peminjaman Alat Digital yang Terstruktur dan Transparan",
                    landingSubtitle: "Platform modern dengan sistem 3 level pengguna yang memudahkan pengelolaan, monitoring, dan pelaporan peminjaman alat secara real-time.",
                    landingDescription: "Website ini digunakan untuk mencatat dan mengelola seluruh proses peminjaman dan pengembalian alat secara real-time.",
                });
            }

            const updatedData = {
                siteName: siteName || settings.siteName,
                landingTitle: landingTitle || settings.landingTitle,
                landingSubtitle: landingSubtitle || settings.landingSubtitle,
                landingDescription: landingDescription !== undefined ? landingDescription : settings.landingDescription,
            };

            if (req.file) {
                // Delete old logo file if exists and starts with /uploads/
                if (settings.siteLogo && settings.siteLogo.startsWith("/uploads/")) {
                    const fileName = path.basename(settings.siteLogo);
                    const oldPath = path.resolve(process.cwd(), "public/uploads", fileName);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }
                updatedData.siteLogo = `/uploads/${req.file.filename}`;
            }

            await settings.update(updatedData);

            res.status(200).json({
                message: "Settings updated successfully",
                data: settings,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update settings.",
                error: error.message,
            });
        }
    }
};
