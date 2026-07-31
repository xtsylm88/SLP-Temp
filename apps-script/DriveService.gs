// apps-script/DriveService.gs
/**
 * Abstraksi Layanan Google Drive untuk Upload Dokumen Pendukung.
 */

var DriveService = {
  /**
   * Upload file blob ke Google Drive Folder
   * @param {Object} filePayload Payload file yang dikirim dari backend (base64/blob)
   * @param {string} [folderId] ID Folder Google Drive target
   * @returns {{ fileId: string, url: string, fileName: string }}
   */
  upload: function(filePayload, folderId) {
    if (!filePayload || !filePayload.base64 || !filePayload.fileName) {
      throw new Error("Payload file tidak valid. Membutuhkan base64 dan fileName.");
    }

    var targetFolderId = folderId || Config.UPLOAD_FOLDER_ID;
    var folder;

    try {
      folder = DriveApp.getFolderById(targetFolderId);
    } catch (e) {
      // Fallback jika folder ID placeholder belum diganti, simpan di Root Drive
      folder = DriveApp.getRootFolder();
    }

    var decodedData = Utilities.base64Decode(filePayload.base64);
    var mimeType = filePayload.mimeType || MimeType.PDF;
    var blob = Utilities.newBlob(decodedData, mimeType, filePayload.fileName);

    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return {
      fileId: file.getId(),
      url: file.getUrl(),
      fileName: file.getName()
    };
  },

  /**
   * Menghapus file dari Google Drive berdasarkan File ID
   * @param {string} fileId 
   */
  delete: function(fileId) {
    if (!fileId) throw new Error("fileId wajib diisi.");
    try {
      var file = DriveApp.getFileById(fileId);
      file.setTrashed(true);
      return { fileId: fileId, deleted: true };
    } catch (e) {
      throw new Error("Gagal menghapus file: " + e.toString());
    }
  },

  /**
   * Mengambil URL publik file
   * @param {string} fileId 
   * @returns {string}
   */
  getPublicUrl: function(fileId) {
    if (!fileId) throw new Error("fileId wajib diisi.");
    var file = DriveApp.getFileById(fileId);
    return file.getUrl();
  }
};
